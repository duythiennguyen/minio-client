using log4net;
using log4net.Config;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Minio;
using Minio.DataModel;
using MinioManagement.Data.Models.DBContext;
using MinioManagement.Services.Enums;
using MinioManagement.Services.Global;
using MinioManagement.Services.Repositories;
using MinioManagement.Services.Service.DBContext.FileFolders;
using MinioManagement.Services.Service.DBContext.Files;
using MinioManagement.Services.Service.DBContext.Folders;
using MinioManagement.Services.Service.ListenBucketNoti;
using MinioManagement.Services.Service.MinIO.Object;
using MinioManagement.Services.Service.Sanpham;
using MinioManagementAPI.Core;
using MinioManagementAPI.Service;
using System.Reflection;
using File = System.IO.File;


XmlConfigurator.Configure(LogManager.GetRepository(Assembly.GetEntryAssembly()), new FileInfo("log4net.config"));
var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<FormOptions>(x =>
{
    // x.ValueLengthLimit = int.MaxValue;
    x.MultipartBodyLengthLimit = int.Parse(builder.Configuration["MultipartBodyLengthLimit"]) * 1000000; //giới hạn kích thước (đv: bytes) của từng file
});

builder.Services.AddControllers();

builder.Services.AddDbContext<MinioDataContext>(a => a.UseSqlServer(builder.Configuration.GetConnectionString("ConnectDB")));


#region MinIO Config

var minioConfiguration = builder.Configuration.GetSection("Minio");
var minioServer = minioConfiguration["Server"];
var minioPort = minioConfiguration["Port"] ?? "9000";
var minioAccessKey = minioConfiguration["AccessKey"];
var minioSecretKey = minioConfiguration["SecretKey"];
var minioSSL = bool.Parse(minioConfiguration["SSL"] ?? "false");

builder.Services.AddSingleton(new ClientInfo
{
    Schema = minioConfiguration["Schema"],
    UserName = minioConfiguration["UserName"],
    Password = minioConfiguration["Password"],
    Server = minioServer,
    AccessKey = minioAccessKey,
    SecretKey = minioSecretKey,
    Port = minioPort
});

using var minioClient = new MinioClient()
    .WithEndpoint(minioServer, int.Parse(minioPort))
    .WithCredentials(minioAccessKey, minioSecretKey)
    .WithSSL(minioSSL)
    .Build();



builder.Services.AddSingleton(minioClient);
builder.Services.AddSingleton<IObjectService, ObjectServiceAPI>();

builder.Services.AddSingleton<ISanphamService, SanphamServicev2>();

builder.Services.AddSingleton<IFileService, FileService>();
builder.Services.AddSingleton<IFileFolderService, FileFolderService>();
builder.Services.AddSingleton<IFolderService, FolderService>();

builder.Services.AddSingleton<IListenBucketNotiService, ListenBucketNotiService>();
EngineContext.SetServiceProvider(builder.Services.BuildServiceProvider());


#endregion

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
log4net.ILog _Log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
builder.Services.AddSingleton<SanPhamRepository>();

#region IndentityServer4
builder.Services.AddAuthentication("Bearer").AddIdentityServerAuthentication("Bearer", options =>
{
    options.Authority = builder.Configuration.GetValue<string>("IdentityServer:Url");
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.EnableCaching = true;
    options.CacheDuration = TimeSpan.FromHours(30);
    options.ApiName = builder.Configuration.GetValue<string>("IdentityServer:ApiName");
    options.ApiSecret = builder.Configuration.GetValue<string>("IdentityServer:ClientSecret");
});
#endregion 

#region Swagger
builder.Services.AddSwaggerGen(c =>
      {
          c.SwaggerDoc("v1", new OpenApiInfo { Title = "Services", Version = "v1" });

          c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
          {
              Type = SecuritySchemeType.OAuth2,
              Flows = new OpenApiOAuthFlows
              {
                  Implicit = new OpenApiOAuthFlow
                  {
                      AuthorizationUrl = new Uri(builder.Configuration.GetValue<string>("IdentityServer:Url") + "/connect/authorize"),
                      Scopes = new Dictionary<string, string> { { "api.identityserver", "IdentityServer API" } },
                      TokenUrl = new Uri(builder.Configuration.GetValue<string>("IdentityServer:Url") + "/connect/token"),
                  },
              },

          });
          c.AddSecurityRequirement(new OpenApiSecurityRequirement
          {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        new List<string>{ "file","openid","profile" }
                    }
          });
      });
#endregion

var app = builder.Build();

ListenBucketNotifications.Run(minioClient, new List<int>() { (int)EEventType.ObjectCreatedAll, (int)EEventType.ObjectRemovedAll }, "sanpham");

IHostApplicationLifetime hostApplicationLifetime = app.Lifetime;


string fileInitPath = AppDomain.CurrentDomain.BaseDirectory + @"\AppInit.init";
hostApplicationLifetime.ApplicationStarted.Register(() =>
{
    _Log.Info("App Start at " + DateTime.Now);
    if (File.Exists(fileInitPath))
    {
        var lastStoppingTime = DateTime.Parse(File.ReadAllText(fileInitPath));
        ListenBucketNotifications.SyncDataFromLastStop(lastStoppingTime);

    }
});

hostApplicationLifetime.ApplicationStopping.Register(() =>
{
    _Log.Info("App STOP at " + DateTime.Now + " " + AppDomain.CurrentDomain.BaseDirectory);

    string defaultContent = DateTime.Now.ToString();
    File.WriteAllText(fileInitPath, defaultContent);

});
hostApplicationLifetime.ApplicationStopped.Register(() =>
{
    Thread.Sleep(TimeSpan.FromSeconds(5));

});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

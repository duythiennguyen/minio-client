using System.Reflection;
using log4net;
using log4net.Config;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Minio;
using MinioManagement.Data.Models.DBContext;
using MinioManagement.Services.Global;
using MinioManagement.Services.Service.MinIO.Object;
using MinioManagement.Services.Service.Sanpham;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using MinioManagementWeb.Areas.Identity.Data;
using Microsoft.AspNetCore.Authorization;
using MinioManagement.Services.Filters.Authorization;
using MinioManagement.Services.Repositories;


#region log4net
XmlConfigurator.Configure(LogManager.GetRepository(Assembly.GetEntryAssembly()), new FileInfo("log4net.config"));
log4net.ILog _Log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
#endregion


var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
// {
//     options.LoginPath = "/User/Index";
//     options.AccessDeniedPath = "/User/Forbidden";
// });
// builder.Services.AddSession(options =>
// {
//     options.IdleTimeout = TimeSpan.FromMinutes(5);
//     options.Cookie.HttpOnly = true;
//     options.Cookie.IsEssential = true;
// });

builder.Services.Configure<FormOptions>(x =>
{
    // x.ValueLengthLimit = int.MaxValue;
    x.MultipartBodyLengthLimit = int.Parse(builder.Configuration["MultipartBodyLengthLimit"]) * 1000000; //giới hạn kích thước (đv: bytes) của từng file
});
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<MinioDataContext>(a => a.UseSqlServer(builder.Configuration.GetConnectionString("ConnectDB")));
builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true).AddRoles<IdentityRole>().AddEntityFrameworkStores<MinioDataContext>();

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

// using var minioClient = new MinioClient()
//     .WithEndpoint(minioServer, int.Parse(minioPort))
//     .WithCredentials(minioAccessKey, minioSecretKey)
//     .WithSSL(minioSSL)
//     .Build();

// builder.Services.AddSingleton(minioClient);


// Đăng ký các phiên bản MinioClient với DI
// builder.Services.AddHttpClient<IMinioClient, MinioClient>();

builder.Services.AddScoped<IMinioClient>(serviceProvider =>
{
    var currentUser = serviceProvider.GetRequiredService<IHttpContextAccessor>().HttpContext.User;
    var accessKey = "";
    var secretKey = "";

    foreach (var item in AppConfig.DefaultRolesList)
    {
        if (currentUser.IsInRole(item))
        {
            accessKey = builder.Configuration.GetSection("MinioKeysByRole:" + item + ":AccessKey").Value;
            secretKey = builder.Configuration.GetSection("MinioKeysByRole:" + item + ":SecretKey").Value;
        }
    }

    // Console.WriteLine(accessKey);

    var minioClient = new MinioClient().WithEndpoint(minioServer, int.Parse(minioPort))
                                                .WithCredentials(accessKey, secretKey)
                                                .WithSSL(minioSSL)
                                                .Build();

    return minioClient;
});




builder.Services.AddTransient<IObjectService, ObjectService>();


#endregion
Console.WriteLine(minioConfiguration["UserName"]);

builder.Services.AddTransient<ISanphamService, SanphamServicev2>();



builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CustomRolePolicy", policy =>
    {
        policy.Requirements.Add(new CustomRoleRequirement(AppConfig.DefaultRolesList[0]));
    });
});
builder.Services.AddScoped<IAuthorizationHandler, CustomRoleHandler>();


builder.Services.AddSingleton<SanPhamRepository>();
var app = builder.Build();


#region SET APP LIFE TIME
IHostApplicationLifetime hostApplicationLifetime = app.Lifetime;
hostApplicationLifetime.ApplicationStarted.Register(() =>
{
    _Log.Info("App Start at " + DateTime.Now);
});

hostApplicationLifetime.ApplicationStopping.Register(() =>
{
    _Log.Info("App STOP at " + DateTime.Now + " " + AppDomain.CurrentDomain.BaseDirectory);
});
hostApplicationLifetime.ApplicationStopped.Register(() =>
{
    Thread.Sleep(TimeSpan.FromSeconds(5));
});
#endregion

#region Default Role registry

using (var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    //Seed Roles
    foreach (var item in AppConfig.DefaultRolesList)
    {
        var check = await roleManager.RoleExistsAsync(item);
        if (!check)
        {
            await roleManager.CreateAsync(new IdentityRole(item));
            _Log.Info("Role registry: " + item);
        }
    }
}
#endregion

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();


app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();

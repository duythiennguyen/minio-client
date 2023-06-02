using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

public static class AppConfig
{
    public static IConfiguration Configuration { get; }

    public static string[] DefaultRolesList { get; }

    public static string[] ListPrefixFolderTypes { get; }
    public static string[] ListSuffixFolderTypes { get; }

    public static Dictionary<string, List<string>> ValidFileTypesByFolder { get; }
    public static Dictionary<string, List<string>> ValidExtensionsByFileType { get; }
    static AppConfig()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

        Configuration = builder.Build();

        DefaultRolesList = Configuration.GetSection("DefaultRolesList").GetChildren().Select(x => x.Value).ToArray();


        ListPrefixFolderTypes = Configuration.GetSection("Template:LstPrefixFolderTypes").GetChildren().Select(x => x.Value).ToArray();
        ListSuffixFolderTypes = Configuration.GetSection("Template:LstSuffixFolderTypes").GetChildren().Select(x => x.Value).ToArray();

        var b = new Dictionary<string, List<string>>();
        Configuration.GetSection("ValidFileTypesByFolder").Bind(b);
        ValidFileTypesByFolder = b;

        var c = new Dictionary<string, List<string>>();
        Configuration.GetSection("ValidExtensionsByFileType").Bind(c);
        ValidExtensionsByFileType = c;


    }

   
       
}
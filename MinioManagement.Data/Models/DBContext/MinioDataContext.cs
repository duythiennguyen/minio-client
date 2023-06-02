using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace MinioManagement.Data.Models.DBContext
{
    public class MinioDataContext : IdentityDbContext
    {
        public MinioDataContext()
        {

        }

        public MinioDataContext(DbContextOptions<MinioDataContext> options) : base(options)
        {
        }
        public virtual DbSet<File> File { get; set; }
        public virtual DbSet<FileFolder> FileFolder { get; set; }
        public virtual DbSet<FileTag> FileTag { get; set; }
        public virtual DbSet<Folder> Folder { get; set; }
        public virtual DbSet<FolderPermission> FolderPermission { get; set; }
        public virtual DbSet<Tag> Tag { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // string envName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                // var absolutePath = AppContext.BaseDirectory;

                IConfigurationRoot configuration = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile($"appsettings.json", optional: true, reloadOnChange: true).Build();
                optionsBuilder.UseSqlServer(configuration.GetConnectionString("ConnectDB"));
                // optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=Minio.SanPham;Integrated Security=False;Persist Security Info=False;User ID=sa;Password=123456;TrustServerCertificate=True");

                // optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=Minio;Integrated Security=False;Persist Security Info=False;User ID=sa;Password=123456;TrustServerCertificate=True");
                //optionsBuilder.UseSqlServer("data source=MSI\\SQLEXPRESS; initial catalog= MinIO; integrated security=true;TrustServerCertificate=True");
            }
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityUserLogin<string>>().HasKey(x => x.UserId);
            modelBuilder.Entity<IdentityRole>().HasKey(x => x.Id);
            modelBuilder.Entity<IdentityUserRole<string>>().HasKey(x => new { x.RoleId, x.UserId });
            modelBuilder.Entity<IdentityUserToken<string>>().HasKey(t => new { t.UserId, t.LoginProvider, t.Name });

            modelBuilder.Entity<File>(entity =>
           {
           });

            modelBuilder.Entity<FileFolder>(entity =>
           {
           });

            modelBuilder.Entity<Folder>(entity =>
           {
           });

            modelBuilder.Entity<FolderPermission>(entity =>
           {
           });

            modelBuilder.Entity<FileTag>(entity =>
           {
           });

            modelBuilder.Entity<Tag>(entity =>
           {
           });


        }

    }
}
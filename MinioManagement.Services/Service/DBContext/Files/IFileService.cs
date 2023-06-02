using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinioManagement.Data.Models.DBContext;
using File = MinioManagement.Data.Models.DBContext.File;

namespace MinioManagement.Services.Service.DBContext.Files
{
    public interface IFileService
    {
        Task<File> GetById(int id);
        Task<List<File>> GetAll();
        Task Create(File file);
        Task Update(File file);
        Task Delete(File file);
    }

}
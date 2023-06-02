using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinioManagement.Data.Models.DBContext;

namespace MinioManagement.Services.Service.DBContext.FileFolders
{
    public interface IFileFolderService
    {
        Task<FileFolder> GetById(int id);
        Task<List<FileFolder>> GetAll();
        Task Create(FileFolder fileFolder);
        Task Update(FileFolder fileFolder);
        Task Delete(FileFolder fileFolder);
    }

}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinioManagement.Data.Models.DBContext;

namespace MinioManagement.Services.Service.DBContext.Folders
{
    public interface IFolderService
    {
        Task<Folder> GetById(int id);
        Task<List<Folder>> GetAll();
        Task Create(Folder folder);
        Task Update(Folder folder);
        Task Delete(Folder folder);
    }

}
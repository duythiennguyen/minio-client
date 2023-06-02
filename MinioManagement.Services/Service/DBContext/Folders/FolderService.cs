using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MinioManagement.Data.Models.DBContext;

namespace MinioManagement.Services.Service.DBContext.Folders
{
    public class FolderService : IFolderService
    {
        // private readonly MinioDataContext _dbContext;

        // public FolderService(MinioDataContext dbContext)
        // {
        //     _dbContext = dbContext;
        // }

        // public async Task<Folder> GetById(int id)
        // {
        //     return await _dbContext.Folder.FindAsync(id);
        // }

        // public async Task<List<Folder>> GetAll()
        // {
        //     return await _dbContext.Folder.ToListAsync();
        // }

        // public async Task Create(Folder folder)
        // {
        //     _dbContext.Folder.Add(folder);
        //     await _dbContext.SaveChangesAsync();
        // }

        // public async Task Update(Folder folder)
        // {
        //     _dbContext.Folder.Update(folder);
        //     await _dbContext.SaveChangesAsync();
        // }

        // public async Task Delete(Folder folder)
        // {
        //     _dbContext.Folder.Remove(folder);
        //     await _dbContext.SaveChangesAsync();
        // }
        public async Task Create(Folder folder)
        {
            using (var db = new MinioDataContext())
            {
                db.Folder.Add(folder);
                await db.SaveChangesAsync();
            }
        }

        public Task Delete(Folder folder)
        {
            throw new NotImplementedException();
        }

        public Task<List<Folder>> GetAll()
        {
            throw new NotImplementedException();
        }

        public async Task<Folder> GetById(int id)
        {
            using (var db = new MinioDataContext())
            {
                return await db.Folder.FindAsync(id);
            }
        }

        public Task Update(Folder folder)
        {
            throw new NotImplementedException();
        }
    }

}
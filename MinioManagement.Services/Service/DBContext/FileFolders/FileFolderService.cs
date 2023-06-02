using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MinioManagement.Data.Models.DBContext;

namespace MinioManagement.Services.Service.DBContext.FileFolders
{
    public class FileFolderService : IFileFolderService
    {
        // private readonly MinioDataContext _dbContext;

        // public FileFolderService(MinioDataContext dbContext)
        // {
        //     _dbContext = dbContext;
        // }

        // public async Task<FileFolder> GetById(int id)
        // {
        //     return await _dbContext.FileFolder.FindAsync(id);
        // }

        // public async Task<List<FileFolder>> GetAll()
        // {
        //     return await _dbContext.FileFolder.ToListAsync();
        // }

        // public async Task Create(FileFolder fileFolder)
        // {
        //     _dbContext.FileFolder.Add(fileFolder);
        //     await _dbContext.SaveChangesAsync();
        // }

        // public async Task Update(FileFolder fileFolder)
        // {
        //     _dbContext.FileFolder.Update(fileFolder);
        //     await _dbContext.SaveChangesAsync();
        // }

        // public async Task Delete(FileFolder fileFolder)
        // {
        //     _dbContext.FileFolder.Remove(fileFolder);
        //     await _dbContext.SaveChangesAsync();
        // }
        public Task Create(FileFolder fileFolder)
        {
            throw new NotImplementedException();
        }

        public Task Delete(FileFolder fileFolder)
        {
            throw new NotImplementedException();
        }

        public Task<List<FileFolder>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<FileFolder> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Task Update(FileFolder fileFolder)
        {
            throw new NotImplementedException();
        }
    }

}
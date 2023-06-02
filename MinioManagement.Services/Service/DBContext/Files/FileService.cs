using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MinioManagement.Data.Models.DBContext;
using File = MinioManagement.Data.Models.DBContext.File;

namespace MinioManagement.Services.Service.DBContext.Files
{
    public class FileService : IFileService
    {
        // private readonly MinioDataContext _dbContext;

        // public FileService(MinioDataContext dbContext)
        // {
        //     _dbContext = dbContext;
        // }

        // public async Task<File> GetById(int id)
        // {
        //     return await _dbContext.File.FindAsync(id);
        // }

        // public async Task<List<File>> GetAll()
        // {
        //     return await _dbContext.File.ToListAsync();
        // }

        // public async Task Create(File file)
        // {
        //     _dbContext.File.Add(file);
        //     await _dbContext.SaveChangesAsync();
        // }

        // public async Task Update(File file)
        // {
        //     _dbContext.File.Update(file);
        //     await _dbContext.SaveChangesAsync();
        // }

        // public async Task Delete(File file)
        // {
        //     _dbContext.File.Remove(file);
        //     await _dbContext.SaveChangesAsync();
        // }
        public Task Create(File file)
        {
            throw new NotImplementedException();
        }

        public Task Delete(File file)
        {
            throw new NotImplementedException();
        }

        public Task<List<File>> GetAll()
        {
            throw new NotImplementedException();
        }

        public Task<File> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Task Update(File file)
        {
            throw new NotImplementedException();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace MinioManagement.Services.Repositories
{
    public class SanPhamRepository
    {
        private readonly string _connectionString;

        public SanPhamRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DBSanPham");
        }

        public async Task<IEnumerable<T>> GetAllAsync<T>(string query)
        {
            using (IDbConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var result = await connection.QueryAsync<T>(query);
                return result;
            }
        }
    }
}
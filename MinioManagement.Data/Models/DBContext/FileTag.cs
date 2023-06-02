using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Data.Models.DBContext
{
    public class FileTag
    {
        public int Id { get; set; }
        public int FileId { get; set; }
        public int TagId { get; set; }
    }
}
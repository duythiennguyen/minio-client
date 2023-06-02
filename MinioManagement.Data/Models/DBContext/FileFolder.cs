using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Data.Models.DBContext
{
    public class FileFolder
    {
        public int Id { get; set; }
        public int FolderId { get; set; }
        public int FileId { get; set; }
    }
}
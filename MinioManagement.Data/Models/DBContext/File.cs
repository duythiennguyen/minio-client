using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Data.Models.DBContext
{
    public class File
    {
        public int Id { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        public int Size { get; set; }
        [StringLength(100)]
        public string Type { get; set; }
        [StringLength(50)]
        public string Extension { get; set; }
        [StringLength(int.MaxValue)]
        public string Path { get; set; }
        [StringLength(int.MaxValue)]
        public string Url { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime Created { get; set; } = DateTime.Now;
        [Column(TypeName = "datetime")]
        public DateTime Updated { get; set; } = DateTime.Now;
        [StringLength(100)]
        public string CreateBy { get; set; }
        [StringLength(100)]
        public string UpdateBy { get; set; }
    }

}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Minio.DataModel;
using MinioManagement.Services.Enums;

namespace MinioManagement.Services.ViewModels
{
    public class VmFileItem //này dùng để hiển thị trên view _PartialThongKe
    {
        // public Item item { get; set; }
        public string FileType { get; set; }
        public string Url { get; set; }
        public string FileName { get; set; }
        public string FolderType { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinioManagement.Services.Models;

namespace MinioManagement.Services.ViewModels
{
    public class SearchSanPhamResult : SanPhamInfo
    {
        public int TotalRow { get; set; }
        public Nullable<long> Row { get; set; }

        public List<VmFileItem> ListFiles { get; set; } = new List<VmFileItem>();

    }
}
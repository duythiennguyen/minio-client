using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Services.ViewModels
{
    public class SearchSanPham : SearchFilter
    {
        //-1 = all
        public string BoId { get; set; } = "-1";
        public string HoavanId { get; set; } = "-1";
        public string ThuonghieuId { get; set; } = "-1";
        public int IsExistFile { get; set; } = -1;//-1=notUse, 0 =false, 1=true
    }
}
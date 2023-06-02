using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Services.ViewModels
{
    public class SearchFilter
    {
        public string Keyword { get; set; } = string.Empty;
        public int PageSize { get; set; } = 5;
        public int PageIndex { get; set; } = 1;
        public DateTime StartDate { get; set; } = new DateTime(2020, 1, 1);
        public DateTime EndDate { get; set; } = DateTime.UtcNow;
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Services.ViewModels
{
    public class RequestImportFile
    {
        public string Id { get; set; }
        public List<string> Files { get; set; } = new List<string>();
        public string Folder { get; set; } = "";
    }
}
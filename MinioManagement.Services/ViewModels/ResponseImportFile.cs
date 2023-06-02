using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Services.ViewModels
{
    public class ResponseImportFile
    {

        public ResponseImportFile(string id, string folder)
        {
            this.Id = id;
            this.Folder = folder;
        }
        public string Id { get; set; }
        public List<string> ListFilesUploadSucceed { get; set; } = new List<string>();
        public List<string> ListFilesUploadFailed { get; set; } = new List<string>();
        public string Folder { get; set; } = "";
        public string ErrorMessage { get; set; } = "";

        public void SetErrorMessage(string mess)
        {
            this.ErrorMessage += $"{Id}/{Folder}: {mess}";
        }
    }
}
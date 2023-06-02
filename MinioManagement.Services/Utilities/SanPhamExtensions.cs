using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinioManagement.Services.Global;

namespace MinioManagement.Services.Utilities
{
    public static class SanPhamExtensions
    {
        public static string GenerateFilePath(string project, string bo, string hoavan, string id, string folderType, string name)
        {
            return $"{project}/{bo}/{hoavan}/{id}/{folderType}/{name}";
        }

        public static string GenerateURLSanPham(this ClientInfo clientInfo, string path)
        {
            return $"{clientInfo.Schema}://{clientInfo.Server}:{clientInfo.Port}/sanpham/{path}";
        }

        public static bool CheckValidFileExtension(string fileExtension, string folderType)
        {
            var getFileTypesByFolder = AppConfig.ValidFileTypesByFolder.FirstOrDefault(x => x.Key == folderType).Value;
            foreach (var fileTypeItem in getFileTypesByFolder)
            {
                var lstExtensionByFileType = AppConfig.ValidExtensionsByFileType.FirstOrDefault(x => x.Key == fileTypeItem).Value;
                if (lstExtensionByFileType.Contains(fileExtension))
                {
                    return true;
                }
            }

            return false;

        }

        public static string GetPureFileTypeByExtension(string fileExtension)
        {
            var result = AppConfig.ValidExtensionsByFileType.FirstOrDefault(x => x.Value.Contains(fileExtension)).Key ?? "undefined";
            return result;
        }

    }
}
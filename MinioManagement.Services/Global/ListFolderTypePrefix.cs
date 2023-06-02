using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MinioManagement.Services.Enums;

namespace MinioManagement.Services.Global
{
    public static class ListFolderTypeSuffix
    {
        public static string Get(ESanPhamFolderType folderType)
        {

            List<string> list = new List<string>(){
                "avatar",
                "image",
                "video"
            };

            return list[(int)folderType];
        }
    }
}
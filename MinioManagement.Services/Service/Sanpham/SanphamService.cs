// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using Microsoft.AspNetCore.Http;
// using Minio;
// using Minio.DataModel;
// using MinioManagement.Services.Enums;
// using MinioManagement.Services.Global;
// using MinioManagement.Services.Models;
// using MinioManagement.Services.Service.MinIO.Object;

// namespace MinioManagement.Services.Service.Sanpham
// {
//     public class SanphamService //: ISanphamService
//     {
//         private readonly IObjectService objectService;
//         private readonly MinioClient minio;
//         private readonly ClientInfo clientInfo;

//         public SanphamService(IObjectService objectService, MinioClient minio, ClientInfo clientInfo)
//         {
//             this.objectService = objectService;
//             this.minio = minio;
//             this.clientInfo = clientInfo;
//         }

//         public async Task<ErrorObject> GetSanPhamInfos()
//         {
//             var error = Errors.Success();
//             try
//             {

//                 var listSP = new List<SanPhamInfo>();

//                 for (int i = 1; i <= 10; i++)
//                 {
//                     listSP.Add(new SanPhamInfo()
//                     {
//                         Id = i,
//                         Name = "SanPham" + i,
//                         BoId = i % 3,
//                         BoName = "Bo-" + i % 3,
//                         HoavanId = i % 4,
//                         HoavanName = "HoaVan-" + i % 4,
//                         ProjectId = i % 2,
//                         ProjectName = "Project" + i % 2
//                     });
//                 }


//                 return error.SetData(listSP);
//             }
//             catch (Exception ex)
//             {

//                 return error.Failed(ex.Message.ToString());
//             }
//         }

//         public async Task<ErrorObject> GetSanPhamById(string sanPhamID)
//         {
//             var error = Errors.Success();
//             try
//             {
//                 var ds = await GetSanPhamInfos();
//                 SanPhamInfo sanPhamInfo = ds.GetData<List<SanPhamInfo>>()?.FirstOrDefault(x => x.Id.ToString() == sanPhamID);
//                 if (sanPhamInfo == null)
//                 {
//                     return error.Failed("Can not found with id: " + sanPhamID);
//                 }
//                 return error.SetData(sanPhamInfo);
//             }
//             catch (Exception ex)
//             {

//                 return error.Failed(ex.Message.ToString());
//             }
//         }

//         private string GenerateFilePath(string project, string bo, string hoavan, string id, string extension, string name)
//         {

//             return string.Format(@"/{0}/{1}/{2}/{3}/{4}/{5}", project, bo, hoavan, id, extension, name);
//         }

//         // public async Task<ErrorObject> Upload(IFormFile file, string sanPhamID)
//         // {
//         //     var error = Errors.Success();
//         //     try
//         //     {


//         //         var ds = await GetSanPhamInfos();
//         //         SanPhamInfo sanPhamInfo = ds.GetData<List<SanPhamInfo>>()?.FirstOrDefault(x => x.Id.Equals(sanPhamID));
//         //         if (sanPhamInfo == null)
//         //         {
//         //             return error.Failed("Can not found with id: " + sanPhamID);
//         //         }



//         //         var path = string.Format(@"/{0}/{1}/{2}/{3}/{4}", sanPhamInfo.ProjectName, sanPhamInfo.BoName, sanPhamInfo.HoavanName, sanPhamInfo.Id, file.FileName);
//         //         using (var stream = file.OpenReadStream())
//         //         {
//         //             var res = await objectService.Upload(minio, "sanpham", path, stream);
//         //             if (res.Code != Errors.SUCCESS.Code)
//         //             {
//         //                 return error.Failed("Can not upload " + path);
//         //             }
//         //         }

//         //         var resultURL = string.Format(@"{0}://{1}:{2}/{3}{4}", clientInfo.Schema, clientInfo.Server, clientInfo.Port, "sanpham", path);
//         //         return error.SetData(resultURL);

//         //     }
//         //     catch (Exception ex)
//         //     {

//         //         return error.Failed(ex.Message.ToString());
//         //     }
//         // }

//         public async Task<ErrorObject> Upload(IFormFile file, SanPhamInfo sanPhamInfo)
//         {
//             var error = Errors.Success();
//             try
//             {
//                 if (file == null || sanPhamInfo == null)
//                 {
//                     return error.Failed("File input can not null, id: " + sanPhamInfo?.Id);
//                 }

//                 string extension = Path.GetExtension(file.FileName).ToLower();
//                 var path = "";
//                 if (extension == ".mp4" || extension == ".avi" || extension == ".wmv" || extension == ".mov")
//                 {
//                     path = GenerateFilePath(sanPhamInfo.ProjectName, sanPhamInfo.BoName, sanPhamInfo.HoavanName, sanPhamInfo.Id.ToString(), "video", file.FileName);
//                 }

//                 if (extension == ".jpg" || extension == ".jpeg" || extension == ".png" || extension == ".gif")
//                 {
//                     path = GenerateFilePath(sanPhamInfo.ProjectName, sanPhamInfo.BoName, sanPhamInfo.HoavanName, sanPhamInfo.Id.ToString(), "image", file.FileName);
//                 }

//                 if (path == "")
//                 {
//                     return error.Failed("Invalid file type " + extension);
//                 }

//                 using (var stream = file.OpenReadStream())
//                 {
//                     var res = await objectService.Upload("sanpham", path, stream);
//                     if (res.Code != Errors.SUCCESS.Code)
//                     {
//                         return error.Failed("Can not upload " + path);
//                     }
//                 }

//                 var resultURL = string.Format(@"{0}://{1}:{2}/{3}{4}", clientInfo.Schema, clientInfo.Server, clientInfo.Port, "sanpham", path);
//                 return error.SetData(resultURL);

//             }
//             catch (Exception ex)
//             {

//                 return error.Failed(ex.Message.ToString());
//             }
//         }


//         private EFileType CheckFileType(string url)
//         {
//             var extension = Path.GetExtension(url);
//             if (extension == ".mp4" || extension == ".avi" || extension == ".wmv" || extension == ".mov")
//             {
//                 return EFileType.Video;
//             }

//             if (extension == ".jpg" || extension == ".jpeg" || extension == ".png" || extension == ".gif")
//             {
//                 return EFileType.Image;
//             }

//             return EFileType.Undified;

//         }

//         public async Task<ErrorObject> GetAllFile_ByFileTypesAndSanPham(SanPhamInfo sanPhamInfo, int folderType = 999)
//         {
//             var error = Errors.Success();
//             try
//             {
//                 var suffix = folderType != 999 ? ListFolderTypeSuffix.Get((ESanPhamFolderType)folderType) : "";
//                 var path = GenerateFilePath(sanPhamInfo.ProjectName, sanPhamInfo.BoName, sanPhamInfo.HoavanName, sanPhamInfo.Id.ToString(), suffix, "");

//                 var listResult = await objectService.ListObjects("sanpham", path, true);

//                 var list = new List<ViewModels.VmFileItem>();
//                 foreach (var item in listResult.GetData<List<Item>>())
//                 {
//                     var resultURL = string.Format(@"{0}://{1}:{2}/{3}/{4}", clientInfo.Schema, clientInfo.Server, clientInfo.Port, "sanpham", item.Key);

//                     list.Add(new ViewModels.VmFileItem()
//                     {
//                         // item = item,
//                         FileType = CheckFileType(item.Key),
//                         Url = resultURL,
//                         FileName = Path.GetFileName(item.Key)
//                     });
//                 }


//                 return error.SetData(list);
//             }
//             catch (Exception ex)
//             {
//                 return error.Failed(ex.Message.ToString());
//             }
//         }

//         public async Task<ErrorObject> SetAvatar(string imageURL)
//         {
//             var error = Errors.Success();
//             try
//             {
//                 int startIndex = imageURL.IndexOf("sanpham");

//                 if (startIndex == -1)
//                 {
//                     return error.Failed("Invalid URL");
//                 }
//                 // Lấy các ký tự sau chuỗi "sanpham"
//                 string path = imageURL.Substring(startIndex + "sanpham".Length);
//                 string pathDest = path.Replace("image", "avatar");

//                 await objectService.CopyObject("sanpham", path, "sanpham", pathDest);
//                 return error;
//             }
//             catch (Exception ex)
//             {
//                 return error.Failed(ex.Message.ToString());
//             }
//         }
//     }
// }
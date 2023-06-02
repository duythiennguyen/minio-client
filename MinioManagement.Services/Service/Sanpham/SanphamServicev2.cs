using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Minio.DataModel;
using MinioManagement.Data.Models.DBContext;
using MinioManagement.Services.Enums;
using MinioManagement.Services.Global;
using MinioManagement.Services.Models;
using MinioManagement.Services.Repositories;
using MinioManagement.Services.Service.MinIO.Object;
using MinioManagement.Services.Utilities;
using MinioManagement.Services.ViewModels;
using Newtonsoft.Json;

namespace MinioManagement.Services.Service.Sanpham
{
    public class SanphamServicev2 : ISanphamService
    {
        private readonly IObjectService objectService;
        private readonly ClientInfo clientInfo;

        private readonly SanPhamRepository sanPhamRepository;


        log4net.ILog _Log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public SanphamServicev2(IObjectService objectService, ClientInfo clientInfo, SanPhamRepository sanPhamRepository)
        {
            this.objectService = objectService;
            this.clientInfo = clientInfo;
            this.sanPhamRepository = sanPhamRepository;
        }


        public async Task<ErrorObject> GetAllFile_ByFileTypesAndSanPham(SanPhamInfo sanPhamInfo, int folderType = 999)
        {
            var error = Errors.Success();
            try
            {
                var listSuffixFolderTypes = AppConfig.ListSuffixFolderTypes;

                var suffix = folderType != 999 ? listSuffixFolderTypes[folderType] : "";// 999 lấy all

                // var path = SanPhamExtensions.GenerateFilePath(sanPhamInfo.ThuonghieuId, sanPhamInfo.BoId, sanPhamInfo.HoavanId, sanPhamInfo.Id.ToString(), suffix, "");
                var list = new List<ViewModels.VmFileItem>();

                using (var db = new MinioDataContext())
                {
                    var result = from fi in db.File
                                 join ff in db.FileFolder on fi.Id equals ff.FileId
                                 join fo in db.Folder on ff.FolderId equals fo.Id
                                 where fo.Name == sanPhamInfo.Id.ToString() && (suffix == "" || fo.Type.Contains(suffix))
                                 select new VmFileItem()
                                 {
                                     FileName = fi.Name,
                                     FileType = fi.Type,
                                     Url = fi.Url,
                                     FolderType = fo.Type
                                 };

                    if (result != null)
                    {
                        list = result.ToList();
                    }
                }


                return error.SetData(list);
            }
            catch (Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));
                return error.Failed(ex.Message.ToString());
            }
        }


        public async Task<ErrorObject> GetSanPhamById(string sanPhamID)
        {
            var error = Errors.Success();
            try
            {
                string query = @"select sanpham.MAKH as Id, sanpham.Name as Name, bo.MaThuongHieu as ThuonghieuId, th.TenThuongHieu as ThuonghieuName, bo.MaNhomCt as BoId, bo.Name as BoName, hv.MaHoaVan as HoavanId, hv.Name as HoavanName
                                from [Y_B_DMHH] sanpham 
                                join [Y_B_DM hoa van] hv on sanpham.MaHoaVan=hv.MaHoaVan 
                                join [Y_B_DMNHOMCT] bo on sanpham.MANhomCT = bo.MaNhomCt   
                                join [Y_B_DMThuongHieu] th on th.MaThuongHieu = bo.MaThuongHieu
                                where  sanpham.makh='" + sanPhamID + "'";
                var result = await sanPhamRepository.GetAllAsync<SanPhamInfo>(query);
                var sanPhamInfo = result.FirstOrDefault();

                if (sanPhamInfo == null)
                {
                    return error.Failed("Can not found with id: " + sanPhamID);
                }
                return error.SetData(sanPhamInfo);
            }
            catch (Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));

                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> GetSanPhamInfos()
        {
            var error = Errors.Success();
            try
            {

                var listSP = new List<SanPhamInfo>();

                // for (int i = 1; i <= 10; i++)
                // {
                //     listSP.Add(new SanPhamInfo()
                //     {
                //         Id = i,
                //         Name = "SanPham" + i,
                //         BoId = i % 3,
                //         BoName = "Bo-" + i % 3,
                //         HoavanId = i % 4,
                //         HoavanName = "HoaVan-" + i % 4,
                //         ProjectId = i % 2,
                //         ProjectName = "Project" + i % 2
                //     });
                // }
                string query = @"select top 10 sanpham.MAKH as Id, sanpham.Name as Name, bo.MaThuongHieu as ThuonghieuId, bo.MaThuongHieu as ThuonghieuName, bo.MaNhomCt as BoId, bo.Name as BoName, hv.MaHoaVan as HoavanId, hv.TenHoaVan as HoavanName
                                from [Y_B_DMHH] sanpham 
                                join [Y_B_DM hoa van] hv on sanpham.MaHoaVan=hv.MaHoaVan 
                                join [Y_B_DMNHOMCT] bo on sanpham.MANhomCT = bo.MaNhomCt    ";
                var result = await sanPhamRepository.GetAllAsync<SanPhamInfo>(query);

                return error.SetData(listSP);
            }
            catch (Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));

                return error.Failed(ex.Message.ToString());
            }
        }

        public bool IsUrlValid(string url)
        {
            Uri uriResult;
            bool isValidUrl = Uri.TryCreate(url, UriKind.Absolute, out uriResult)
                && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);

            return isValidUrl;
        }

        public async Task<ErrorObject> Search(SearchSanPham searchSanPham)
        {
            var error = Errors.Success();
            try
            {
                var listSanPhamIds = new List<string>();
                if (searchSanPham.IsExistFile != -1)
                {
                    using (var dbContext = new MinioDataContext())
                    {
                        listSanPhamIds = (
                              from fi in dbContext.File
                              join ff in dbContext.FileFolder on fi.Id equals ff.FileId
                              join fo in dbContext.Folder on ff.FolderId equals fo.Id
                              select fo.Name
                          ).Distinct().ToList();

                    }
                }
                var listStringParams = "";
                if (listSanPhamIds.Count > 0)
                {
                    listStringParams = String.Join(",", listSanPhamIds);
                }
                Console.WriteLine(listStringParams);
                bool isUrl = IsUrlValid(searchSanPham.Keyword);
                if (isUrl)
                {


                    using (var dbContext = new MinioDataContext())
                    {
                        var listSPResult = new List<SearchSanPhamResult>();
                        var listSanPhamIds2 = (
                                from fi in dbContext.File
                                join ff in dbContext.FileFolder on fi.Id equals ff.FileId
                                join fo in dbContext.Folder on ff.FolderId equals fo.Id
                                where fi.Url == searchSanPham.Keyword
                                select fo.Name
                            ).Distinct().ToList();

                        Console.WriteLine(searchSanPham.PageIndex);

                        if (!String.IsNullOrEmpty(listSanPhamIds2.First()))
                        {
                            string query = $"exec [dbo].[SP_SearchSanPham] '{searchSanPham.ThuonghieuId}', '{searchSanPham.BoId}', '{searchSanPham.HoavanId}','{listSanPhamIds2.First()}',{searchSanPham.PageSize},{searchSanPham.PageIndex}, {searchSanPham.IsExistFile}, '{listStringParams}' ";
                            listSPResult = (await sanPhamRepository.GetAllAsync<SearchSanPhamResult>(query)).ToList();
                        }

                        for (int i = 0; i < listSPResult.Count; i++)
                        {
                            var item = listSPResult[i];
                            var result = from fi in dbContext.File
                                         join ff in dbContext.FileFolder on fi.Id equals ff.FileId
                                         join fo in dbContext.Folder on ff.FolderId equals fo.Id
                                         where fo.Name == item.Id
                                         select new VmFileItem()
                                         {
                                             FileName = fi.Name,
                                             FileType = fi.Type,
                                             Url = fi.Url,
                                             FolderType = fo.Type
                                         };
                            listSPResult[i].ListFiles = result.ToList();
                        }

                        return error.SetData(listSPResult);

                    }
                }

                // listSP = listSP.Where(x => (searchSanPham.BoId == "-1" || x.BoId == searchSanPham.BoId)
                // && (searchSanPham.HoavanId == "-1" || x.HoavanId == searchSanPham.HoavanId) && (searchSanPham.ProjectId == "-1" || x.ThuonghieuId == searchSanPham.ProjectId)
                // && (String.IsNullOrEmpty(searchSanPham.Keyword) || x.Name.Trim().ToLower().Contains(searchSanPham.Keyword.Trim().ToLower()) || x.Id.ToString().ToLower().Contains(searchSanPham.Keyword.ToLower()))
                //  ).ToList();
                // listSP = listSP.Skip(searchSanPham.PageSize * (searchSanPham.PageIndex - 1)).Take(searchSanPham.PageSize).ToList();

                var listSP2 = new List<SearchSanPhamResult>();

                string query2 = $"exec [dbo].[SP_SearchSanPham] '{searchSanPham.ThuonghieuId}', '{searchSanPham.BoId}', '{searchSanPham.HoavanId}','{searchSanPham.Keyword?.TrimStart().TrimEnd()}',{searchSanPham.PageSize},{searchSanPham.PageIndex}, {searchSanPham.IsExistFile}, '{listStringParams}'";
                listSP2 = (await sanPhamRepository.GetAllAsync<SearchSanPhamResult>(query2)).ToList();

                using (var dbContext = new MinioDataContext())
                {
                    for (int i = 0; i < listSP2.Count; i++)
                    {
                        var item = listSP2[i];
                        var result = from fi in dbContext.File
                                     join ff in dbContext.FileFolder on fi.Id equals ff.FileId
                                     join fo in dbContext.Folder on ff.FolderId equals fo.Id
                                     where fo.Name == item.Id
                                     select new VmFileItem()
                                     {
                                         FileName = fi.Name,
                                         FileType = fi.Type,
                                         Url = fi.Url,
                                         FolderType = fo.Type
                                     };
                        listSP2[i].ListFiles = result.ToList();
                    }
                }

                return error.SetData(listSP2);
            }
            catch (Exception ex)
            {

                _Log.Error(JsonConvert.SerializeObject(ex));
                return error.Failed(ex.Message.ToString());
            }
        }

        public Task<ErrorObject> SetAvatar(string imageURL)
        {
            throw new NotImplementedException();
        }

        public async Task<ErrorObject> Upload(IFormFile file, SanPhamInfo sanPhamInfo, string folderType = "")
        {
            var error = Errors.Success();
            try
            {
                if (file == null || sanPhamInfo == null)
                {
                    _Log.Info("File input can not null, id: " + sanPhamInfo?.Id);
                    return error.Failed("File input can not null, id: " + sanPhamInfo?.Id);
                }

                string extension = Path.GetExtension(file.FileName).ToLower();

                if (folderType == "")//nếu ko có folder type thì sẽ auto chọn theo extensions (chỉ gồm image, video)
                {
                    folderType = SanPhamExtensions.GetPureFileTypeByExtension(extension);
                    if (folderType == "undefined")
                    {
                        _Log.Info("Invalid file extension: " + extension);
                        return error.Failed("Invalid file extension: " + extension);
                    }
                }

                var check = SanPhamExtensions.CheckValidFileExtension(extension, folderType);
                if (!check)
                {
                    _Log.Info("Invalid File input extensions `" + extension + "` for folder: " + folderType);
                    return error.Failed("Invalid File input extensions `" + extension + "` for folder: " + folderType);
                }

                Console.WriteLine(folderType);
                var path = SanPhamExtensions.GenerateFilePath(sanPhamInfo.ThuonghieuId, sanPhamInfo.BoId, sanPhamInfo.HoavanId, sanPhamInfo.Id.ToString(), folderType, file.FileName);

                using (var stream = file.OpenReadStream())
                {
                    var res = await objectService.Upload("sanpham", path, stream);
                    if (res.Code != Errors.SUCCESS.Code)
                    {
                        _Log.Info(res.Message + "Can not upload " + path);
                        return error.Failed(" Can not upload " + path);
                    }
                }

                var resultURL = clientInfo.GenerateURLSanPham(path);
                _Log.Info("Upload succeed: " + resultURL);
                return error.SetData(resultURL);

            }
            catch (Exception ex)
            {

                _Log.Error(JsonConvert.SerializeObject(ex));
                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> GetPrivateFileFromFolderByURL(string url)
        {
            var error = Errors.Success();
            try
            {

                var presignURL = "";
                bool isUrl = IsUrlValid(url);
                if (!isUrl)
                {
                    return error.Failed("Invalid url: " + url);
                }
                using (var dbContext = new MinioDataContext())
                {
                    var listFromDB = (
                            from fi in dbContext.File
                            join ff in dbContext.FileFolder on fi.Id equals ff.FileId
                            join fo in dbContext.Folder on ff.FolderId equals fo.Id
                            where fi.Url == url
                            select fi
                        ).Distinct().ToList();

                    if (listFromDB == null)
                    {
                        return error.Failed("Not found any sanphams with url: " + url);
                    }

                    var path = listFromDB.FirstOrDefault().Path + "/" + listFromDB.FirstOrDefault().Name;

                    presignURL = (await objectService.PresignedGetObject("sanpham", path, 60)).GetData<string>();

                    return error.SetData(new { presignURL = presignURL, fileType = listFromDB.FirstOrDefault().Type });
                }


            }
            catch (Exception ex)
            {

                _Log.Error(JsonConvert.SerializeObject(ex));
                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> GetListThuongHieu()
        {
            var error = Errors.Success();
            try
            {

                string query = @"select th.MaThuongHieu as Id, th.TenThuongHieu as Name from [Y_B_DMThuongHieu] th";
                var result = await sanPhamRepository.GetAllAsync<ThuongHieuInfo>(query);

                return error.SetData(result);
            }
            catch (Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));

                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> GetListBo()
        {
            var error = Errors.Success();
            try
            {

                string query = @"select bo.MaNhomCt as Id, bo.Name as Name from [Y_B_DMNHOMCT] bo ";
                var result = await sanPhamRepository.GetAllAsync<BoInfo>(query);

                return error.SetData(result);
            }
            catch (Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));

                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> GetListHoavan()
        {
            var error = Errors.Success();
            try
            {

                string query = @"select hv.MaHoaVan as Id, hv.TenHoaVan as Name from [Y_B_DM hoa van] hv";
                var result = await sanPhamRepository.GetAllAsync<HoaVanInfo>(query);

                return error.SetData(result);
            }
            catch (Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));

                return error.Failed(ex.Message.ToString());
            }
        }
    }
}
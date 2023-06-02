using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minio.DataModel;
using MinioManagement.Services.Global;
using MinioManagement.Services.Models;
using MinioManagement.Services.Service.Sanpham;
using MinioManagement.Services.ViewModels;
using Newtonsoft.Json;
using System.Linq;

namespace MinioManagementWeb.Controllers
{
    // [Authorize(Policy = "CustomRolePolicy")]
    [Authorize]
    public class SanphamController : Controller
    {
        private readonly ILogger<SanphamController> _logger;

        private readonly ISanphamService sanphamService;
        private readonly IConfiguration _configuration;

        public SanphamController(ILogger<SanphamController> logger, ISanphamService sanphamService, IConfiguration configuration)
        {
            _logger = logger;
            this.sanphamService = sanphamService;
            _configuration = configuration;
        }


        public async Task<IActionResult> Index()
        {
            var sanPhamInfoList = await this.sanphamService.GetSanPhamInfos();
            ViewBag.SanPhamInfoList = sanPhamInfoList.Data;
            ViewBag.MultipartBodyLengthLimit = _configuration["MultipartBodyLengthLimit"];

            ViewBag.GetListThuongHieu = (await sanphamService.GetListThuongHieu()).GetData<IEnumerable<ThuongHieuInfo>>();
            ViewBag.GetListBo = (await sanphamService.GetListBo()).GetData<IEnumerable<BoInfo>>();
            ViewBag.GetListHoavan = (await sanphamService.GetListHoavan()).GetData<IEnumerable<HoaVanInfo>>();

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Search(SearchSanPham searchSanPham)
        {
            ViewBag.PageIndex = searchSanPham.PageIndex;
            ViewBag.PageSize = searchSanPham.PageSize;

            var sanPhamInfoList = await this.sanphamService.Search(searchSanPham);

            return PartialView("_PartialListSanPham", sanPhamInfoList.Data);
        }


        [HttpPost]
        [DisableRequestSizeLimit]
        // [RequestFormLimits(MultipartBodyLengthLimit = 37 * 1000000)]
        public async Task<IActionResult> Upload(IFormFile[] formFiles, string sanPhamID, string folderType = "")
        {
            try
            {
                Console.WriteLine(sanPhamID + "  " + folderType);
                var listSucceedResultURL = new List<string>();
                var listFailedResultURL = new List<string>();
                var a = Request.Form.Files.Count;
                if (formFiles.Length > 0)
                {
                    var sanPhamInfo = await this.sanphamService.GetSanPhamById(sanPhamID);
                    // Duyệt qua từng file được tải lên
                    for (int i = 0; i < formFiles.Length; i++)
                    {
                        var res = await this.sanphamService.Upload(formFiles[i], sanPhamInfo.GetData<SanPhamInfo>(), folderType);
                        if (res.Code != Errors.SUCCESS.Code)
                        {
                            _logger.LogInformation("Failed to upload: " + formFiles[i].FileName);
                            listFailedResultURL.Add(formFiles[i].FileName);
                            continue;
                        }

                        listSucceedResultURL.Add(res.Data.ToString());
                    }
                }
                var response = new
                {
                    listSucceedResultURL = listSucceedResultURL,
                    listFailedResultURL = listFailedResultURL,
                    Code = Errors.SUCCESS.Code,
                    Message = "Đã xử lý xong"
                };
                return Json(response);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message.ToString());
                var response = new { Code = Errors.FAILED.Code, Message = ex.Message.ToString() };
                return Json(response);
            }
        }


        [HttpPost]
        [DisableRequestSizeLimit]
        // [RequestFormLimits(MultipartBodyLengthLimit = 37 * 1000000)]
        public async Task<IActionResult> Import(IFormFile[] formFiles, string json)
        {
            try
            {
                var listImportFiles = JsonConvert.DeserializeObject<List<RequestImportFile>>(json)?.OrderBy(x => x.Id).ToList();
                var response = new List<ResponseImportFile>();

                var a = Request.Form.Files.Count;//này để check form size

                if (formFiles.Length > 0 && listImportFiles != null)
                {
                    foreach (var item in listImportFiles)
                    {
                        var responseImportFile = new ResponseImportFile(item.Id, item.Folder);

                        if (item.Files.Count == 0)
                        {
                            continue;
                        }

                        var sanPhamInfo = await this.sanphamService.GetSanPhamById(item.Id);
                        if (sanPhamInfo.Data == null)//Ko tìm thấy sanpham
                        {
                            responseImportFile.ListFilesUploadFailed.AddRange(item.Files);
                            item.Files.ForEach(x =>
                            {
                                responseImportFile.SetErrorMessage($"{x} (Không tìm thấy sản phẩm). ");
                            });
                            response.Add(responseImportFile);

                            continue;
                        }

                        foreach (var fileNameItem in item.Files)
                        {
                            var f = formFiles.FirstOrDefault(x => x.FileName == fileNameItem);
                            if (f == null)//Không tìm thấy file truyền vào
                            {
                                responseImportFile.ListFilesUploadFailed.Add(fileNameItem);
                                responseImportFile.SetErrorMessage($"{fileNameItem} (Không tìm thấy file). ");

                                continue;
                            }

                            var res = await this.sanphamService.Upload(f, sanPhamInfo.GetData<SanPhamInfo>(), item.Folder);
                            if (res.Code != Errors.SUCCESS.Code)//Upload thất bại
                            {
                                responseImportFile.ListFilesUploadFailed.Add(f.FileName);
                                responseImportFile.SetErrorMessage($"{f.FileName} ({res.Message}). ");

                                continue;
                            }

                            responseImportFile.ListFilesUploadSucceed.Add(res.GetData<string>());
                        }
                    
                        response.Add(responseImportFile);
                    }
                }

                return Json(response);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message.ToString());
                var response = new { Code = Errors.FAILED.Code, Message = ex.Message.ToString() };
                return Json(response);
            }
        }

        [HttpPost]
        public async Task<IActionResult> LoadThongKe(string sanPhamID)
        {
            try
            {
                var sanPhamInfo = await this.sanphamService.GetSanPhamById(sanPhamID);
                var list = await sanphamService.GetAllFile_ByFileTypesAndSanPham(sanPhamInfo.GetData<SanPhamInfo>());
                ViewBag.SanPhamName = sanPhamInfo.GetData<SanPhamInfo>().Name;
                return PartialView("_PartialThongKe", list.GetData<List<VmFileItem>>());
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message.ToString());
                var response = new { Code = Errors.FAILED.Code, Message = ex.Message.ToString() };
                return Json(response);
            }
        }

        // [Authorize(Roles = "admin")]
        [HttpPost]
        public async Task<IActionResult> GetPrivateFileFromFolderByURL(string url)
        {
            try
            {
                var presignURL = (await sanphamService.GetPrivateFileFromFolderByURL(url)).GetData<object>();
                return Json(presignURL);
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message.ToString());
                var response = new { Code = Errors.FAILED.Code, Message = ex.Message.ToString() };
                return Json(response);
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View("Error!");
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MinioManagement.Services.Global;
using MinioManagement.Services.Models;
using MinioManagement.Services.Service.Sanpham;
using MinioManagement.Services.ViewModels;
using Newtonsoft.Json;

namespace MinioManagementAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SanPhamController : ControllerBase
    {
        log4net.ILog _Log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        private readonly ISanphamService sanphamService;

        public SanPhamController(ISanphamService sanPhamService)
        {
            this.sanphamService = sanPhamService;
        }

        [HttpPost]
        [Route("Upload")]
        [DisableRequestSizeLimit]
        public async Task<object> Upload(IFormFile[] formFiles, string sanPhamID, string folderType = "")
        {
            try
            {
                var clientIpAddress = Request.HttpContext.Connection.RemoteIpAddress;

                _Log.Info("Call Upload from: " + clientIpAddress + "---SanPham: " + sanPhamID + "---folder: " + folderType + "---filesCount: " + Request.Form.Files.Count);
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
                            listFailedResultURL.Add($"{formFiles[i].FileName}: {res.Message}");
                            continue;
                        }

                        listSucceedResultURL.Add(res.Data.ToString());
                    }
                }
                var response = new
                {
                    listSucceedResultURL = listSucceedResultURL,
                    listFailedResultURL = listFailedResultURL,
                    StatusCode = Errors.SUCCESS.Code,
                    Message = "Đã xử lý xong"
                };
                return response;
            }
            catch (System.Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));
                var response = new { Code = Errors.FAILED.Code, Message = ex.Message.ToString() };
                return (response);
            }
        }

        [HttpGet]
        public async Task<object> GetFileSanPhamById(string sanPhamID, int folderType = 999)
        {
            try
            {
                var sanPhamInfo = await this.sanphamService.GetSanPhamById(sanPhamID);
                var list = await sanphamService.GetAllFile_ByFileTypesAndSanPham(sanPhamInfo.GetData<SanPhamInfo>(), folderType);
                return new
                {
                    SanPhamName = sanPhamInfo.GetData<SanPhamInfo>().Name,
                    ListFile = list.GetData<List<VmFileItem>>(),
                    StatusCode = Errors.SUCCESS.Code,

                };
            }
            catch (System.Exception ex)
            {
                _Log.Error(JsonConvert.SerializeObject(ex));
                var response = new { Code = Errors.FAILED.Code, Message = ex.Message.ToString() };
                return (response);
            }
        }

    }
}
using Microsoft.AspNetCore.Http;
using MinioManagement.Services.Global;
using MinioManagement.Services.Models;
using MinioManagement.Services.ViewModels;

namespace MinioManagement.Services.Service.Sanpham
{
    public interface ISanphamService
    {
        Task<ErrorObject> GetSanPhamInfos();
        Task<ErrorObject> GetSanPhamById(string sanPhamID);
        Task<ErrorObject> Search(SearchSanPham searchSanPham);

        Task<ErrorObject> Upload(IFormFile file, SanPhamInfo sanPhamInfo, string folderType = "");
        // Task<ErrorObject> GetFilesBySPId(string sanPhamID);
        // Task<ErrorObject> GetMainFileBySPId(string sanPhamID);//3. File chính của sp là gì?
        // Task<ErrorObject> GetAllFileTypesBySPId(string sanPhamID);//2. Sản phẩm đó có những loại file gì?
        Task<ErrorObject> GetAllFile_ByFileTypesAndSanPham(SanPhamInfo sanPhamInfo, int folderType = 999);//4. 1 sản phẩm có bao nhiêu hình, video?
        Task<ErrorObject> SetAvatar(string imageURL);


        Task<ErrorObject> GetPrivateFileFromFolderByURL(string url);

        Task<ErrorObject> GetListThuongHieu();
        Task<ErrorObject> GetListBo();
        Task<ErrorObject> GetListHoavan();



    }
}
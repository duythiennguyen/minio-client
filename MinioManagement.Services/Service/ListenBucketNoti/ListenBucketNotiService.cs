using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel;
using MinioManagement.Data.Models.DBContext;
using MinioManagement.Services.Enums;
using MinioManagement.Services.Global;
using MinioManagement.Services.Models;
using MinioManagement.Services.Service.DBContext.FileFolders;
using MinioManagement.Services.Service.DBContext.Files;
using MinioManagement.Services.Service.DBContext.Folders;
using Newtonsoft.Json;
using MinioManagement.Services.Utilities;
using Object = MinioManagement.Services.Models.Object;
using MinioManagement.Services.Service.MinIO.Object;

namespace MinioManagement.Services.Service.ListenBucketNoti
{

    public class ListenBucketNotiService : IListenBucketNotiService
    {
        private readonly MinioClient minio;
        private readonly IFileFolderService _fileFolderService;
        private readonly IFolderService _folderService;
        private readonly IFileService _fileService;
        private readonly IConfiguration configuration;
        private readonly ClientInfo clientInfo;
        private readonly IObjectService objectService;
        log4net.ILog _Log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public ListenBucketNotiService(MinioClient minio, IFileFolderService fileFolderService, IFolderService folderService, IFileService fileService, IConfiguration configuration, ClientInfo clientInfo, IObjectService objectService)
        {
            this.minio = minio;
            _fileFolderService = fileFolderService;
            _folderService = folderService;
            _fileService = fileService;
            this.configuration = configuration;
            this.clientInfo = clientInfo;
            this.objectService = objectService;
        }

        private void CreateOrUpdateFileFolder(string objectKey, int objectSize, DateTime? updatedTime = null)// objectKey = "Project/HoaVan/Bo/SanPham/image/img.png"
        {

            try
            {
                var lstPrefixFolderTypes = AppConfig.ListPrefixFolderTypes;
                var lstSuffixFolderTypes = AppConfig.ListSuffixFolderTypes;

                var path = Path.GetDirectoryName(objectKey)?.Replace("\\", "/");// này ko có filename "Project/HoaVan/Bo/SanPham/image"
                var fileName = Path.GetFileName(objectKey);// này chỉ lấy filename "img.png"
                var extension = Path.GetExtension(objectKey);// này lấy ".png"

                if (path == null || !path.Contains("/"))
                {
                    _Log.Info("1. Upload file với path ko đúng: " + objectKey);
                    return;
                }

                string[] lstFolders = path.Split('/');

                #region Check xem file có đc upload đúng đường dẫn ko?, đuôi file có hợp lệ ko?

                if (lstFolders.Length < 2 || lstFolders.Length > 5 || !lstSuffixFolderTypes.ToList().Contains(lstFolders[lstFolders.Length - 1]))
                {
                    _Log.Info("2. Upload file ngoài template: " + objectKey);
                    return;
                }

                if (!SanPhamExtensions.CheckValidFileExtension(extension, lstFolders[lstFolders.Length - 1]))
                {
                    _Log.Info("3. Upload file với đuôi ko cho phép: " + objectKey);
                    return;
                }
                #endregion

                // var objectDataID = lstFolders[lstFolders.Length - 2];// lấy đc id "SanPham"

                #region Tạo Folder

                var folder = new Folder();
                for (int i = 0; i <= lstFolders.Length - 1; i++)
                {
                    var folderString = lstFolders[i];

                    folder.Name = i == (lstFolders.Length - 1) ? lstFolders[i - 1] : folderString;//nếu là cuối thì Name bằng áp cuối
                    folder.Type = i == (lstFolders.Length - 1) ? lstPrefixFolderTypes[i - 1] + "/" + folderString : lstPrefixFolderTypes[i];
                    folder.ParentId = i == 0 ? i : folder.Id;//nếu là project thì ko có parent (parentId =0)
                    folder.UpdateBy = "0";
                    folder.Updated = DateTime.Now;

                    using (var db = new MinioDataContext())
                    {

                        var folder2 = db.Folder.FirstOrDefault(x => x.Name == folder.Name && x.Type == folder.Type);
                        if (folder2 == null)//nếu chưa có => tạo mới
                        {
                            folder.Created = DateTime.Now;
                            folder.CreateBy = "0";
                            folder.Id = 0;
                            db.Folder.Add(folder);
                        }
                        else
                        {

                            if (i == (lstFolders.Length - 1))
                            {
                                folder2.UpdateBy = "0";
                                folder2.Updated = DateTime.Now;
                            }
                            db.Folder.Update(folder2);
                            folder = folder2;
                        }


                        db.SaveChanges();
                    }
                }

                #endregion

                #region Tạo file và filefolder

                using (var db = new MinioDataContext())
                {

                    var file = db.File.FirstOrDefault(x => x.Name == fileName && x.Path == path);

                    if (file == null)
                    {
                        file = new Data.Models.DBContext.File();
                        file.Name = fileName;
                        file.Path = path;
                        file.Type = SanPhamExtensions.GetPureFileTypeByExtension(extension);
                        file.Extension = extension;
                        file.Url = clientInfo.GenerateURLSanPham(objectKey);
                        file.CreateBy = "0";
                        file.Created = DateTime.Now;

                        file.Size = objectSize;
                        file.UpdateBy = "0";
                        file.Updated = updatedTime ?? DateTime.Now;

                        db.File.Add(file);
                        db.SaveChanges();

                        var fileFolder = new FileFolder();
                        fileFolder.FileId = file.Id;
                        fileFolder.FolderId = folder.Id;
                        db.FileFolder.Add(fileFolder);

                        db.SaveChanges();


                    }
                    else
                    {
                        file.Size = objectSize;
                        file.UpdateBy = "0";
                        file.Updated = updatedTime ?? DateTime.Now;
                        db.File.Update(file);
                        db.SaveChanges();
                    }
                }

                #endregion

                _Log.Info(" Đã UPLOAD thành công: " + objectKey);


            }
            catch (System.Exception ex)
            {

            }
        }

        public void RemoveFile(string objectKey)
        {
            try
            {
                using (var db = new MinioDataContext())
                {
                    var file = db.File.FirstOrDefault(x => x.Path + "/" + x.Name == $"{objectKey}");
                    if (file != null)
                    {
                        var fileFolder = db.FileFolder.Where(x => x.FileId == file.Id);
                        if (fileFolder != null)
                        {
                            db.FileFolder.RemoveRange(fileFolder);
                        }
                        db.File.Remove(file);
                        db.SaveChanges();
                        _Log.Info(" Đã REMOVE thành công: " + objectKey);

                        return;
                    }

                    _Log.Info(" Remove: không tìm thấy " + objectKey);
                }
            }
            catch (System.Exception ex)
            {
                _Log.Info(ex.Message.ToString());
            }
        }

        public void OnListen(ResultListenBucketNotifi resultListenBucket, int eventType)
        {
            try
            {
                switch (eventType)
                {
                    case (int)EEventType.ObjectAccessedAll:

                        break;
                    case (int)EEventType.ObjectCreatedAll:
                        {
                            foreach (var item in resultListenBucket.Records)
                            {
                                if (!item.eventName.Contains("s3:ObjectCreated") || item.s3.bucket.name != "sanpham")
                                {
                                    continue;
                                }

                                CreateOrUpdateFileFolder(item.s3.@object.key, item.s3.@object.size);
                            }
                            break;
                        }
                    case (int)EEventType.ObjectRemovedAll:
                        foreach (var item in resultListenBucket.Records)
                        {
                            if (!item.eventName.Contains("s3:ObjectRemoved") || item.s3.bucket.name != "sanpham")
                            {
                                continue;
                            }

                            RemoveFile(item.s3.@object.key);
                        }
                        break;
                }

                // throw new NotImplementedException();
            }
            catch (System.Exception ex)
            {

                // throw;
            }
        }

        public async void SyncDataFromLastStop(DateTime lastStoppingTime)
        {
            try
            {
                _Log.Info("-------BẮT ĐẦU SYNC DATA-----------");
                var lstInDB = new List<string>();
                var lstInServer = new List<string>();

                using (var db = new MinioDataContext())
                {
                    var lstAllInServer = await objectService.ListObjects("sanpham", "/", true);
                    lstInServer = lstAllInServer.GetData<List<Item>>().Where(x => x.LastModifiedDateTime >= lastStoppingTime).Select(x => x.Key).ToList();
                    lstInDB = db.File.Select(x => x.Path + "/" + x.Name).ToList();

                    List<string> lstNewCreatedFromServer = lstInServer.Except(lstInDB).ToList();//ds có ở Server mà ko có ở DB (tức là các file được thêm mới trên server)
                    List<string> lstRemovedFromServer = lstInDB.Except(lstAllInServer.GetData<List<Item>>().Select(x => x.Key).ToList()).ToList();//ds có ở DB mà ko có ở Server (tức là các file đã xóa trên server)

                    foreach (var item in lstNewCreatedFromServer)
                    {
                        var a = lstAllInServer.GetData<List<Item>>().FirstOrDefault(x => x.LastModifiedDateTime >= lastStoppingTime && x.Key == item);
                        if (a != null)
                        {
                            CreateOrUpdateFileFolder(a.Key, int.Parse(a.Size.ToString()));
                        }
                    }

                    foreach (string item in lstRemovedFromServer)
                    {
                        Console.WriteLine(item);
                        RemoveFile(item);
                    }


                }

                _Log.Info("-------KẾT THÚC SYNC DATA-----------");

            }
            catch (System.Exception ex)
            {
                _Log.Info($"[Bucket]  Exception: {ex}");
            }
        }

        public async void SyncDataV2(DateTime lastStoppingTime)
        {
            try
            {
                _Log.Info("-------BẮT ĐẦU SyncDataV2-----------");

                using (var db = new MinioDataContext())
                {
                    var lst = await objectService.ListObjects("sanpham", "/", true);

                    var lstAllInServer = lst.GetData<List<Item>>().ToList();
                    var lstInDB = db.File.Select(x => x.Path + "/" + x.Name).ToList();


                    foreach (var item in lstAllInServer)
                    {
                        CreateOrUpdateFileFolder(item.Key, int.Parse(item.Size.ToString()), item.LastModifiedDateTime);
                    }

                    foreach (var item in lstInDB)
                    {
                        if (!lstAllInServer.Select(x => x.Key).Contains(item))
                        {
                            RemoveFile(item);
                        }
                    }


                }

                _Log.Info("-------KẾT THÚC SYNC DATA-----------");

            }
            catch (System.Exception ex)
            {
                _Log.Info($"[Bucket]  Exception: {ex}");
            }
        }
    }
}
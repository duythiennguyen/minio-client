using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Minio;
using MinioManagement.Services.Global;

namespace MinioManagement.Services.Service.MinIO.Object
{
    public interface IObjectService
    {
        Task<ErrorObject> Upload(string bucketName, string objectName, Stream stream);
        Task<ErrorObject> ListObjects(string bucket, string path, bool recursive);
        Task<ErrorObject> CopyObject(string bucket, string path, string bucketDest, string pathDest);
        Task<ErrorObject> PresignedGetObject(string bucket, string path, int expTime);

    }
}
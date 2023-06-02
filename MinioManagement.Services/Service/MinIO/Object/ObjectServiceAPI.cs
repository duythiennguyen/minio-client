using Microsoft.Extensions.DependencyInjection;
using Minio;
using Minio.DataModel;
using MinioManagement.Services.Global;

namespace MinioManagement.Services.Service.MinIO.Object
{
    public class ObjectServiceAPI : IObjectService
    {
        private readonly MinioClient minio;
        public ObjectServiceAPI(MinioClient minio)
        {
            this.minio = minio;
        }

        public async Task<ErrorObject> CopyObject(string bucket, string path, string bucketDest, string pathDest)
        {
            var error = Errors.Success();
            try
            {
                await minio.CopyObjectAsync(new CopyObjectArgs().WithCopyObjectSource(
                    new CopySourceObjectArgs().WithBucket(bucket).WithObject(path))
                    .WithBucket(bucketDest).WithObject(pathDest));

                return error;
            }
            catch (Exception ex)
            {
                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> PresignedGetObject(string bucket, string path, int expTime)
        {
            var error = Errors.Success();
            try
            {
                var presigneGetUrl = await minio.PresignedGetObjectAsync(new PresignedGetObjectArgs().WithBucket(bucket).WithObject(path).WithExpiry(expTime));

                return error.SetData(presigneGetUrl);
            }
            catch (Exception ex)
            {
                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> ListObjects(string bucket, string path, bool recursive)
        {
            var error = Errors.Success();

            try
            {
                bool found = await minio.BucketExistsAsync(new BucketExistsArgs().WithBucket("sanpham"));
                if (!found)
                {
                    return error.Failed("Can not found bucket " + bucket);
                }

                List<Item> listResult = new List<Item>();

                ManualResetEvent completedEvent = new ManualResetEvent(false);
                ListObjectsArgs args2 = new ListObjectsArgs()
                                  .WithBucket("sanpham")
                                  .WithPrefix(path)
                                  .WithRecursive(recursive);
                IObservable<Item> observable = minio.ListObjectsAsync(args2);
                IDisposable subscription = observable.Subscribe(
                        item =>
                        {
                            listResult.Add(item);
                        },
                        ex => Console.WriteLine("OnError: {0}", ex.Message),
                        () =>
                        {
                            Console.WriteLine("OnComplete: {0}");
                            completedEvent.Set(); // Đánh dấu rằng observable đã hoàn thành
                        }
                );

                completedEvent.WaitOne();
                // Giải phóng tài nguyên
                subscription.Dispose();
                completedEvent.Dispose();


                return error.SetData(listResult);
            }
            catch (Exception ex)
            {
                return error.Failed(ex.Message.ToString());
            }
        }

        public async Task<ErrorObject> Upload(string bucketName, string objectName, Stream stream)
        {
            var error = Errors.Success();
            try
            {
                bool found = await minio.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName));
                if (!found)
                {
                    await minio.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));
                }



                var metaData = new Dictionary<string, string>
                {
                    { "Test-Metadata", "Test  Test" }
                };

                var args = new PutObjectArgs()
                    .WithBucket(bucketName)
                    .WithObject(objectName)
                    .WithStreamData(stream)
                    .WithObjectSize(stream.Length)
                    .WithContentType("application/octet-stream")
                    .WithHeaders(metaData);

                var result = await minio.PutObjectAsync(args);
                return error;
            }
            catch (Exception ex)
            {
                return error.Failed(ex.Message.ToString());
            }

        }
    }
}
using MinioManagement.Services.Enums;
using MinioManagement.Services.Global;
using MinioManagement.Services.Models;

namespace MinioManagement.Services.Service.ListenBucketNoti
{
    public interface IListenBucketNotiService
    {
        void OnListen(ResultListenBucketNotifi resultListenBucket, int eventType);
        void SyncDataFromLastStop(DateTime lastStoppingTime);
        void SyncDataV2(DateTime lastStoppingTime);

    }
}
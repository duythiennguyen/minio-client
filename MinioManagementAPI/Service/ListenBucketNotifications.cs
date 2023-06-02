using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Minio;
using Minio.DataModel;
using MinioManagement.Services.Enums;
using MinioManagement.Services.Models;
using MinioManagement.Services.Service.ListenBucketNoti;
using MinioManagementAPI.Core;
using Newtonsoft.Json;

namespace MinioManagementAPI.Service
{
    public static class ListenBucketNotifications
    {
        // private static readonly IListenBucketNotiService listenBucketNotiService = EngineContext.Resolve<IListenBucketNotiService>();
        private static log4net.ILog _Log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public static void Run(MinioClient minio,
            List<int> eEventTypes,
            string bucketName = "my-bucket-name",
            string prefix = "",
            string suffix = "",
            bool recursive = true)
        {
            try
            {
                IListenBucketNotiService listenBucketNotiService = EngineContext.Resolve<IListenBucketNotiService>();

                foreach (var item in eEventTypes)
                {
                    List<EventType> events = new List<EventType>();

                    switch (item)
                    {
                        case (int)EEventType.ObjectCreatedAll:
                            events.Add(EventType.ObjectCreatedAll);
                            break;
                        case (int)EEventType.ObjectRemovedAll:
                            events.Add(EventType.ObjectRemovedAll);
                            break;
                    }

                    if (events.Count == 0)
                    {
                        return;
                    }

                    _Log.Info("Running example for API: ListenBucketNotifications " + eEventTypes);
                    var args = new ListenBucketNotificationsArgs()
                        .WithBucket(bucketName)
                        .WithPrefix(prefix)
                        .WithEvents(events)
                        .WithSuffix(suffix);
                    var observable = minio.ListenBucketNotificationsAsync(bucketName, events, prefix, suffix);
                    var subscription = observable.Subscribe(
                        notification =>
                        {
                            _Log.Info($"Notification: {notification.json}");
                            var resultListenBucketNotifi = JsonConvert.DeserializeObject<ResultListenBucketNotifi>(notification.json);
                            listenBucketNotiService.OnListen(resultListenBucketNotifi, item);
                        },
                        ex => _Log.Info($"OnError: {ex}"),
                        () => _Log.Info("Stopped listening for bucket notifications\n"));

                    // subscription.Dispose();
                }
            }
            catch (Exception e)
            {
                _Log.Info($"[Bucket]  Exception: {e}");
            }
        }

        public static void SyncDataFromLastStop(DateTime lastStoppingTime)
        {
            try
            {
                IListenBucketNotiService listenBucketNotiService = EngineContext.Resolve<IListenBucketNotiService>();
                listenBucketNotiService.SyncDataV2(lastStoppingTime);

            }
            catch (System.Exception ex)
            {

                _Log.Info($"[Bucket]  Exception: {ex}");
            }
        }
    }
}
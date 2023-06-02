using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MinioManagement.Services.Global
{
    public class ClientInfo
    {
        public string Schema { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Server { get; set; }
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string Port { get; set; }
        public string SSL { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace MinioManagement.Services.Filters.Authorization
{
    public class CustomRoleRequirement : IAuthorizationRequirement
    {
        public string Role { get; }

        public CustomRoleRequirement(string role)
        {
            Role = role;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookLibraryServer.Contract.Models.Master
{
    public interface IUserModel : IMasterModel
    {
        public string? Email { get; }
        public string? Code { get; }
        public string? NameKana { get; }
        public string? Notes { get; }
        public int? DepartmentId { get; }
        public string? DepartmentName { get; }
        public bool? IsAdminStaff { get; }
    }
}

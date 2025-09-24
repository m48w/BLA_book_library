using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Models.Master
{
    public class UsersModel : IUserModel
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Code { get; set; }
        public string? NameKana { get; set; }
        public string? PhotoUrl { get; set; }
        public string? Notes { get; set; }
        public int? DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public bool? IsAdminStaff { get; set; }

        // for Dapper
        public UsersModel() { }

        public UsersModel(int? id, string? name, string? email, string? code, string? nameKana, string? photoUrl, string? notes, int? departmentId, string? departmentName, bool? isAdminStaff)
        {
            Id = id;
            Name = name;
            Email = email;
            Code = code;
            NameKana = nameKana;
            PhotoUrl = photoUrl;
            Notes = notes;
            DepartmentId = departmentId;
            DepartmentName = departmentName;
            IsAdminStaff = isAdminStaff;
        }
    }
}

using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Models.Master
{
    public class UsersModel : IUserModel
    {
        public int? Id { get; }
        public string? Name { get; }
        public string? Email { get; }
        public string? Code { get; }
        public string? NameKana { get; }
        public string? Notes { get; }
        public int? DepartmentId { get; }
        public string? DepartmentName { get; }


        public UsersModel(int? id, string? name, string? email, string? code, string? nameKana, string? notes, int? departmentId, string? departmentName)
        {
            Id = id;
            Name = name;
            Email = email;
            Code = code;
            NameKana = nameKana;
            Notes = notes;
            DepartmentId = departmentId;
            DepartmentName = departmentName;
        }
    }
}

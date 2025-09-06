using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Models.Master
{
    public class DepartmentsModel : IDepartmentModel
    {
        public int? Id { get; }
        public string? Name { get; }

        public DepartmentsModel(int? id, string? name)
        {
            Id = id;
            Name = name;
        }
    }
}

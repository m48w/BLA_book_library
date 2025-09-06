using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Models.Master
{
    public class AuthorsModel : IAuthorModel
    {
        public int? Id { get; set; }
        public string? Name { get; set; }

        public AuthorsModel() { }

        public AuthorsModel(int? id, string? name)
        {
            Id = id;
            Name = name;
        }
    }
}

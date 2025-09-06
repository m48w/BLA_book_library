using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Models.Master
{
    public class GenresModel : IGenreModel
    {
        public int? Id { get; set; }
        public string? Name { get; set; }

        public GenresModel (int? id,  string? name)
        {
            Id = id;
            Name = name;
        }

    }
}

using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Models.Master
{
    public class PublishersModel : IPublisherModel
    {
        public int? Id { get; }
        public string? Name { get; }

        public PublishersModel(int? id, string? name)
        {
            Id = id;
            Name = name;
        }
    }
}

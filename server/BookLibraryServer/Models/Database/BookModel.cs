using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Models.Database
{
    public class BookModel : IBookModel
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? PublisherName { get; set; }
        public DateTime? PublicationDate { get; set; }
        public string? Isbn { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? GenreName { get; set; }
        public string? Description { get; set; }
        public string? Notes { get; set; }
        public bool IsRecommended { get; set; }
        public string? AuthorNames { get; set; }
        public string? StatusName { get; set; }
    }
}

namespace BookLibraryServer.Contract.Models.Database
{
    public interface IBookModel
    {
        int Id { get; }
        string Title { get; }
        string? PublisherName { get; }
        DateTime? PublicationDate { get; }
        string? Isbn { get; }
        string? CoverImageUrl { get; }
        string? GenreName { get; }
        string? Description { get; }
        string? Notes { get; }
        bool IsRecommended { get; }
        string? AuthorNames { get; } // Comma-separated author names
        string? StatusName { get; }
    }
}

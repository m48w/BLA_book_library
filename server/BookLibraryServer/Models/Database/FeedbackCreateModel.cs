using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Models.Database;

public class FeedbackCreateModel : IFeedbackCreateModel
{
    public int BookId { get; set; }
    public int UserId { get; set; }
    public string? Comment { get; set; }
    public int? Rating { get; set; }
}

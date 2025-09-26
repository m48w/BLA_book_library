using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Models.Database;

public class FeedbackModel : IFeedbackModel
{
    public int Id { get; set; }
    public int BookId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? Comment { get; set; }
    public int? Rating { get; set; }
    public DateTime CreatedAt { get; set; }
}

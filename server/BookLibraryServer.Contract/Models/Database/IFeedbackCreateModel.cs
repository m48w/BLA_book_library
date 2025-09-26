namespace BookLibraryServer.Contract.Models.Database;

public interface IFeedbackCreateModel
{
    int BookId { get; set; }
    int UserId { get; set; }
    string? Comment { get; set; }
    int? Rating { get; set; }
}

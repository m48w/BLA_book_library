namespace BookLibraryServer.Contract.Models.Database;

public interface IFeedbackModel
{
    int Id { get; set; }
    int BookId { get; set; }
    int UserId { get; set; }
    string UserName { get; set; }
    string? Comment { get; set; }
    int? Rating { get; set; }
    DateTime CreatedAt { get; set; }
}

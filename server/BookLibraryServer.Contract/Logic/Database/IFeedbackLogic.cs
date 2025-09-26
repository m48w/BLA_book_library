using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Logic.Database;

public interface IFeedbackLogic
{
    Task<IEnumerable<IFeedbackModel>> GetByBookIdAsync(int bookId);
    Task<IFeedbackModel?> CreateAsync(IFeedbackCreateModel feedback);
}

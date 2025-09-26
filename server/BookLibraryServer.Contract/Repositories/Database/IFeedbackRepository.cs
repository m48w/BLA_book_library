using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Repositories.Database;

public interface IFeedbackRepository
{
    Task<IEnumerable<IFeedbackModel>> GetByBookIdAsync(int bookId);
    Task<IFeedbackModel?> CreateAsync(IFeedbackCreateModel feedback);
}

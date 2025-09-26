using BookLibraryServer.Contract.Logic.Database;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Repositories.Database;

namespace BookLibraryServer.Logic.Database;

public class FeedbackLogic : IFeedbackLogic
{
    private readonly IFeedbackRepository _feedbackRepository;

    public FeedbackLogic(IFeedbackRepository feedbackRepository)
    {
        _feedbackRepository = feedbackRepository;
    }

    public async Task<IEnumerable<IFeedbackModel>> GetByBookIdAsync(int bookId)
    {
        return await _feedbackRepository.GetByBookIdAsync(bookId);
    }

    public async Task<IFeedbackModel?> CreateAsync(IFeedbackCreateModel feedback)
    {
        // Here you could add business logic, e.g., validation, checks for spam, etc.
        return await _feedbackRepository.CreateAsync(feedback);
    }
}

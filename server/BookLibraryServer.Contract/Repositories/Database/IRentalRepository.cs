using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Repositories.Database
{
    public interface IRentalRepository
    {
        Task<IRentalModel> RecordRentalAsync(int bookId, int userId, DateTime rentalDate, DateTime dueDate);
        Task<IRentalModel?> GetActiveRentalByBookIdAsync(int bookId);
        Task<bool> RecordReturnAsync(int rentalId, DateTime returnDate);
        Task<bool> UpdateBookStatusAsync(int bookId, int newStatusId);
    }
}

using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Logic.Database
{
    public interface IRentalLogic
    {
        Task<IRentalModel> BorrowBookAsync(int bookId, int userId);
        Task<bool> ReturnBookAsync(int bookId);
        Task<IEnumerable<RentalDisplayModel>> GetActiveRentalsAsync();
        Task<IRentalModel> ForceBorrowBookAsync(int bookId, int userId);
        Task<bool> ExtendRentalAsync(int bookId);
    }
}

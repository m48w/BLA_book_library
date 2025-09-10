using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Logic.Database
{
    public interface IRentalLogic
    {
        Task<IRentalModel> BorrowBookAsync(int bookId, int userId);
        Task<bool> ReturnBookAsync(int bookId);
        Task<IEnumerable<RentalDisplayModel>> GetActiveRentalsAsync();
    }
}

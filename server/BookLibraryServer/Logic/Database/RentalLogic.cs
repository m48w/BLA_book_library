using BookLibraryServer.Contract.Logic.Database;
using BookLibraryServer.Contract.Repositories.Database;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Logic;
using BookLibraryServer.Models;
using Microsoft.Extensions.Options;
using BookLibraryServer.Contract.Repositories.Master;

namespace BookLibraryServer.Logic.Database
{
    public class RentalLogic : IRentalLogic
    {
        private readonly IRentalRepository _rentalRepository;
        private readonly IBookRepository _bookRepository;
        private readonly IUserRepository _userRepository;

        // Status IDs from the database
        private const int STATUS_AVAILABLE = 1; // 貸出可能
        private const int STATUS_RENTED = 2;    // 貸出中

        public RentalLogic(IRentalRepository rentalRepository, IBookRepository bookRepository, IUserRepository userRepository)
        {
            _rentalRepository = rentalRepository;
            _bookRepository = bookRepository;
            _userRepository = userRepository;
        }

        public async Task<IRentalModel> BorrowBookAsync(int bookId, int userId)
        {
            Console.WriteLine($"RentalLogic: BorrowBookAsync called for BookId: {bookId}, UserId: {userId}");
            // Check if book is available (optional, but good practice)
            // For simplicity, we assume it's available if not actively rented
            var activeRental = await _rentalRepository.GetActiveRentalByBookIdAsync(bookId);
            if (activeRental != null)
            {
                throw new InvalidOperationException("Book is already rented out.");
            }

            // Record rental
            var rentalDate = DateTime.Now;
            var dueDate = rentalDate.AddDays(14); // Example: 14 days rental period
            var newRental = await _rentalRepository.RecordRentalAsync(bookId, userId, rentalDate, dueDate);

            // Update book status to Rented
            await _rentalRepository.UpdateBookStatusAsync(bookId, STATUS_RENTED);

            return newRental;
        }

        public async Task<bool> ReturnBookAsync(int bookId)
        {
            Console.WriteLine($"RentalLogic: ReturnBookAsync called for BookId: {bookId}");
            // Find active rental for the book
            var activeRental = await _rentalRepository.GetActiveRentalByBookIdAsync(bookId);
            if (activeRental == null)
            {
                return false;
            }

            // Record return date
            var returnDate = DateTime.Now;
            var result = await _rentalRepository.RecordReturnAsync(activeRental.RentalId, returnDate);

            if (result)
            {
                // Update book status to Available
                await _rentalRepository.UpdateBookStatusAsync(bookId, STATUS_AVAILABLE);
            }

            return result;
        }
        public async Task<IRentalModel> ForceBorrowBookAsync(int bookId, int userId)
        {
            // 既存の貸出をチェックし、あれば返却済みにする
            var activeRental = await _rentalRepository.GetActiveRentalByBookIdAsync(bookId);
            if (activeRental != null)
            {
                await _rentalRepository.RecordReturnAsync(activeRental.RentalId, DateTime.Now);
            }

            // 新しい貸出を記録
            var rentalDate = DateTime.Now;
            var dueDate = rentalDate.AddDays(14);
            var newRental = await _rentalRepository.RecordRentalAsync(bookId, userId, rentalDate, dueDate);

            // 書籍のステータスを貸出中に更新
            await _rentalRepository.UpdateBookStatusAsync(bookId, STATUS_RENTED);

            return newRental;
        }

        public async Task<IEnumerable<RentalDisplayModel>> GetActiveRentalsAsync()
        {
            return await _rentalRepository.GetActiveRentalsAsync();
        }
        public async Task<bool> ExtendRentalAsync(int bookId)
        {
            var activeRental = await _rentalRepository.GetActiveRentalByBookIdAsync(bookId);
            if (activeRental == null)
            {
                return false; // No active rental found
            }

            // Extend the due date by a fixed period (e.g., 14 days)
            var newDueDate = activeRental.DueDate.AddDays(14);

            var result = await _rentalRepository.UpdateDueDateAsync(activeRental.RentalId, newDueDate);

            return result;
        }

    }
}

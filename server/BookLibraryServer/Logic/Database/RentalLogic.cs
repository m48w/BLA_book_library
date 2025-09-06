using BookLibraryServer.Contract.Logic.Database;
using BookLibraryServer.Contract.Repositories.Database;
using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Logic.Database
{
    public class RentalLogic : IRentalLogic
    {
        private readonly IRentalRepository _rentalRepository;
        private readonly IBookRepository _bookRepository;

        // Status IDs (assuming these are fixed and known)
        private const int STATUS_AVAILABLE = 1; // 貸出可能
        private const int STATUS_RENTED = 2;    // 貸出中

        public RentalLogic(IRentalRepository rentalRepository, IBookRepository bookRepository)
        {
            _rentalRepository = rentalRepository;
            _bookRepository = bookRepository;
        }

        public async Task<IRentalModel> BorrowBookAsync(int bookId, int userId)
        {
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
            // Find active rental for the book
            var activeRental = await _rentalRepository.GetActiveRentalByBookIdAsync(bookId);
            if (activeRental == null)
            {
                throw new InvalidOperationException("Book is not currently rented.");
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
    }
}

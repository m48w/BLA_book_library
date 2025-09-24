using BookLibraryServer.Contract.Logic.Database;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Repositories.Database;

namespace BookLibraryServer.Logic.Database
{
    public class BookLogic : IBookLogic
    {
        private readonly IBookRepository _bookRepository;

        public BookLogic(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<IEnumerable<IBookModel>> SearchAsync(string? keyword, int? genreId)
        {
            return await _bookRepository.SearchAsync(keyword, genreId);
        }

        public async Task<IBookModel> AddAsync(BookCreateModel book)
        {
            // Add any business logic validation here
            return await _bookRepository.AddAsync(book);
        }

        public async Task<IBookModel?> UpdateAsync(int id, BookCreateModel book)
        {
            return await _bookRepository.UpdateAsync(id, book);
        }

        public async Task<IEnumerable<IBookModel>> GetRecommendedAsync()
        {
            return await _bookRepository.GetRecommendedAsync();
        }

        private const int STATUS_AVAILABLE = 1; // 貸出可能

        public async Task<bool> ForceSetAvailableAsync(int bookId)
        {
            return await _bookRepository.UpdateStatusAsync(bookId, STATUS_AVAILABLE);
        }
    }
}

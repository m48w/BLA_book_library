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

        public async Task<IEnumerable<IBookModel>> SearchAsync(string? keyword)
        {
            return await _bookRepository.SearchAsync(keyword);
        }

        public async Task<IBookModel> AddAsync(BookCreateModel book)
        {
            // Add any business logic validation here
            return await _bookRepository.AddAsync(book);
        }
    }
}

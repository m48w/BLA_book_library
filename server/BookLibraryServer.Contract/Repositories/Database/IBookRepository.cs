using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Repositories.Database
{
    public interface IBookRepository
    {
        Task<IEnumerable<IBookModel>> SearchAsync(string? keyword);
        Task<IBookModel> AddAsync(BookCreateModel book);
    }
}

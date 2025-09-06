using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Logic.Database
{
    public interface IBookLogic
    {
        Task<IEnumerable<IBookModel>> SearchAsync(string? keyword);
        Task<IBookModel> AddAsync(BookCreateModel book);
    }
}

using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Logic.Database
{
    public interface IBookLogic
    {
        Task<IEnumerable<IBookModel>> SearchAsync(string? keyword, int? genreId);
        Task<IBookModel> AddAsync(BookCreateModel book);
        Task<IBookModel?> UpdateAsync(int id, BookCreateModel book);
        Task<IEnumerable<IBookModel>> GetRecommendedAsync();
    }
}

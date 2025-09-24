using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Repositories.Database
{
    public interface IBookRepository
    {
        Task<IEnumerable<IBookModel>> SearchAsync(string? keyword, int? genreId);
        Task<IBookModel> AddAsync(BookCreateModel book);
        Task<IBookModel?> UpdateAsync(int id, BookCreateModel book);
        Task<IEnumerable<IBookModel>> GetRecommendedAsync();
        Task<bool> UpdateStatusAsync(int bookId, int newStatusId);
        Task<IBookModel?> GetByIdAsync(int id);
    }
}
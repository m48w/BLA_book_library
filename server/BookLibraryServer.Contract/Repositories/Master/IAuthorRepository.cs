using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IAuthorRepository
    {
        Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync();
        Task<IEnumerable<IAuthorModel>> SearchAuthorsAsync(string? keyword); // 追加
        Task<IAuthorModel?> GetByIdAsync(int id);
        Task<IAuthorModel> AddAsync(IAuthorModel author);
        Task<bool> UpdateAsync(IAuthorModel author);
        Task<bool> DeleteAsync(int id);
    }
}

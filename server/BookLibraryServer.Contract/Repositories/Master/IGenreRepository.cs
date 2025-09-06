using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IGenreRepository
    {
        Task<IEnumerable<IGenreModel>> SearchAsync(string? keyword);
        Task<IGenreModel?> GetByIdAsync(int id);
        Task<IGenreModel> AddAsync(IGenreModel genre);
        Task<bool> UpdateAsync(IGenreModel genre);
        Task<bool> DeleteAsync(int id);
    }
}

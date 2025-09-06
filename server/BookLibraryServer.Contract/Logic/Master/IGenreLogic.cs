using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IGenreLogic
    {
        Task<IEnumerable<IGenreModel>> SearchAsync(string? keyword);
        Task<IGenreModel?> GetByIdAsync(int id);
        Task<IGenreModel> AddAsync(IGenreModel genre);
        Task<bool> UpdateAsync(int id, IGenreModel genre);
        Task<bool> DeleteAsync(int id);
    }
}

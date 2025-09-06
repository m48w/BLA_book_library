using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IPublisherRepository
    {
        Task<IEnumerable<IPublisherModel>> SearchAsync(string? keyword);
        Task<IPublisherModel?> GetByIdAsync(int id);
        Task<IPublisherModel> AddAsync(IPublisherModel publisher);
        Task<bool> UpdateAsync(IPublisherModel publisher);
        Task<bool> DeleteAsync(int id);
    }
}

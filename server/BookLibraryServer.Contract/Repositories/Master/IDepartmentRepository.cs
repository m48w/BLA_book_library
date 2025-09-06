using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IDepartmentRepository
    {
        Task<IEnumerable<IDepartmentModel>> GetAllAsync();
        Task<IDepartmentModel?> GetByIdAsync(int id);
        Task<IDepartmentModel> AddAsync(IDepartmentModel department);
        Task<bool> UpdateAsync(IDepartmentModel department);
        Task<bool> DeleteAsync(int id);
    }
}

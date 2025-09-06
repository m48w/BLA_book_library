using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IDepartmentLogic
    {
        Task<IEnumerable<IDepartmentModel>> GetAllAsync();
        Task<IDepartmentModel?> GetByIdAsync(int id);
        Task<IDepartmentModel> AddAsync(IDepartmentModel department);
        Task<bool> UpdateAsync(int id, IDepartmentModel department);
        Task<bool> DeleteAsync(int id);
    }
}

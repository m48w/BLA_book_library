using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;

namespace BookLibraryServer.Logic.Master
{
    public class DepartmentLogic : IDepartmentLogic
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentLogic(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<IEnumerable<IDepartmentModel>> GetAllAsync()
        {
            return await _departmentRepository.GetAllAsync();
        }

        public async Task<IDepartmentModel?> GetByIdAsync(int id)
        {
            return await _departmentRepository.GetByIdAsync(id);
        }

        public async Task<IDepartmentModel> AddAsync(IDepartmentModel department)
        {
            return await _departmentRepository.AddAsync(department);
        }

        public async Task<bool> UpdateAsync(int id, IDepartmentModel department)
        {
            var existing = await _departmentRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return false;
            }
            var modelToUpdate = new DepartmentsModel(id, department.Name);
            return await _departmentRepository.UpdateAsync(modelToUpdate);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _departmentRepository.DeleteAsync(id);
        }
    }
}

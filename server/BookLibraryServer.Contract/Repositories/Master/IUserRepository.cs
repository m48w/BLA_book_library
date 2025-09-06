using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Repositories.Master
{
    public interface IUserRepository
    {
        Task<IEnumerable<IUserModel>> SearchAsync(string? keyword);
        Task<IUserModel?> GetUserByIdAsync(int id);
        Task<IUserModel> AddUserAsync(IUserModel user);
        Task<bool> UpdateUserAsync(IUserModel user);
        Task<bool> DeleteUserAsync(int id);
    }
}

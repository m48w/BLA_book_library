using BookLibraryServer.Contract.Models.Master;

namespace BookLibraryServer.Contract.Logic.Master
{
    public interface IUserLogic
    {
        Task<IEnumerable<IUserModel>> SearchAsync(string? keyword);
        Task<IUserModel?> GetUserByIdAsync(int id);
        Task<IUserModel> AddUserAsync(IUserModel user);
        Task<bool> UpdateUserAsync(int id, IUserModel user);
        Task<bool> DeleteUserAsync(int id);
    }
}

using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;

namespace BookLibraryServer.Logic.Master
{
    public class UserLogic : IUserLogic
    {
        private readonly IUserRepository _userRepository;

        public UserLogic(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<IUserModel>> SearchAsync(string? keyword)
        {
            return await _userRepository.SearchAsync(keyword);
        }

        public async Task<IUserModel?> GetUserByIdAsync(int id)
        {
            return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task<IUserModel> AddUserAsync(IUserModel user)
        {
            // ここでバリデーションロジックを実装することも可能です
            return await _userRepository.AddUserAsync(user);
        }

        public async Task<bool> UpdateUserAsync(int id, IUserModel user)
        {
            var existingUser = await _userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return false; // Or throw a NotFoundException
            }

            var userToUpdate = new UsersModel(
                id, // URLから取得したIDを使用
                user.Name,
                user.Email,
                user.Code,
                user.NameKana,
                user.Notes,
                user.DepartmentId,
                null // DepartmentNameはUsersテーブルの一部ではないため更新対象外
            );

            return await _userRepository.UpdateUserAsync(userToUpdate);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _userRepository.DeleteUserAsync(id);
        }
    }
}

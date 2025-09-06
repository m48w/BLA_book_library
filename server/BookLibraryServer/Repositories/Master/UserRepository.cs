using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class UserRepository : IUserRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public UserRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IUserModel>> SearchAsync(string? keyword)
        {
            var query = @"
SELECT
  U.user_id AS Id
  , U.name AS Name
  , U.email AS Email
  , U.code AS Code
  , U.name_kana AS NameKana
  , U.notes AS Notes
  , D.department_id AS DepartmentId
  , D.name AS DepartmentName
FROM dbo.Users AS U
LEFT JOIN dbo.Departments AS D
  ON U.department_id = D.department_id
";

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query += " WHERE U.name LIKE @Keyword OR U.name_kana LIKE @Keyword OR U.email LIKE @Keyword OR U.code LIKE @Keyword";
            }

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var users = await connection.QueryAsync<UsersModel>(query, new { Keyword = $"%{keyword}%" });
                return users.Cast<IUserModel>();
            });
        }

        public async Task<IUserModel?> GetUserByIdAsync(int id)
        {
            var query = @"
SELECT
  U.user_id AS Id
  , U.name AS Name
  , U.email AS Email
  , U.code AS Code
  , U.name_kana AS NameKana
  , U.notes AS Notes
  , D.department_id AS DepartmentId
  , D.name AS DepartmentName
FROM dbo.Users AS U
LEFT JOIN dbo.Departments AS D
  ON U.department_id = D.department_id
WHERE U.user_id = @Id
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var user = await connection.QueryFirstOrDefaultAsync<UsersModel>(query, new { Id = id });
                return user;
            });
        }

        public async Task<IUserModel> AddUserAsync(IUserModel user)
        {
            var query = @"
INSERT INTO dbo.Users (name, email, code, name_kana, notes, department_id)
VALUES (@Name, @Email, @Code, @NameKana, @Notes, @DepartmentId);
SELECT CAST(SCOPE_IDENTITY() as int);
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var newId = await connection.QuerySingleAsync<int>(query, user);
                return (await GetUserByIdAsync(newId))!;
            });
        }

        public async Task<bool> UpdateUserAsync(IUserModel user)
        {
            var query = @"
UPDATE dbo.Users
SET
  name = @Name,
  email = @Email,
  code = @Code,
  name_kana = @NameKana,
  notes = @Notes,
  department_id = @DepartmentId
WHERE user_id = @Id
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, user);
                return affectedRows > 0;
            });
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var query = "DELETE FROM dbo.Users WHERE user_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
                return affectedRows > 0;
            });
        }
    }
}

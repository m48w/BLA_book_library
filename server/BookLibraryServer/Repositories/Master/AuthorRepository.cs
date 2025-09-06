using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class AuthorRepository : IAuthorRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public AuthorRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync()
        {
            var query = "SELECT author_id AS Id, name AS Name FROM dbo.Authors";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var authors = await connection.QueryAsync<AuthorsModel>(query);
                return authors.Cast<IAuthorModel>();
            });
        }

        public async Task<IEnumerable<IAuthorModel>> SearchAuthorsAsync(string? keyword) // 追加
        {
            var query = "SELECT author_id AS Id, name AS Name FROM dbo.Authors";
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query += " WHERE name LIKE @Keyword"; // nameカラムで検索
            }

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var authors = await connection.QueryAsync<AuthorsModel>(query, new { Keyword = $"%{keyword}%" });
                return authors.Cast<IAuthorModel>();
            });
        }

        public async Task<IAuthorModel?> GetByIdAsync(int id)
        {
            var query = "SELECT author_id AS Id, name AS Name FROM dbo.Authors WHERE author_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                return await connection.QueryFirstOrDefaultAsync<AuthorsModel>(query, new { Id = id });
            });
        }

        public async Task<IAuthorModel> AddAsync(IAuthorModel author)
        {
            var query = @"
INSERT INTO dbo.Authors (name) VALUES (@Name);
SELECT CAST(SCOPE_IDENTITY() as int);
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var newId = await connection.QuerySingleAsync<int>(query, new { author.Name });
                return (await GetByIdAsync(newId))!;
            });
        }

        public async Task<bool> UpdateAsync(IAuthorModel author)
        { 
            var query = "UPDATE dbo.Authors SET name = @Name WHERE author_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { author.Name, author.Id });
                return affectedRows > 0;
            });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM dbo.Authors WHERE author_id = @Id"; // 修正
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
                return affectedRows > 0;
            });
        }
    }
}

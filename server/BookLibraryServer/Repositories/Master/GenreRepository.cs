using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class GenreRepository : IGenreRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public GenreRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IGenreModel>> SearchAsync(string? keyword)
        {
            var query = "SELECT genre_id AS Id, name AS Name FROM dbo.Genres";
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query += " WHERE name LIKE @Keyword";
            }

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var genres = await connection.QueryAsync<GenresModel>(query, new { Keyword = $"%{keyword}%" });
                return genres.Cast<IGenreModel>();
            });
        }

        public async Task<IGenreModel?> GetByIdAsync(int id)
        {
            var query = "SELECT genre_id AS Id, name AS Name FROM dbo.Genres WHERE genre_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                return await connection.QueryFirstOrDefaultAsync<GenresModel>(query, new { Id = id });
            });
        }

        public async Task<IGenreModel> AddAsync(IGenreModel genre)
        {
            var query = @"
INSERT INTO dbo.Genres (name) VALUES (@Name);
SELECT CAST(SCOPE_IDENTITY() as int);
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var newId = await connection.QuerySingleAsync<int>(query, new { genre.Name });
                return (await GetByIdAsync(newId))!;
            });
        }

        public async Task<bool> UpdateAsync(IGenreModel genre)
        {
            var query = "UPDATE dbo.Genres SET name = @Name WHERE genre_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { genre.Name, genre.Id });
                return affectedRows > 0;
            });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM dbo.Genres WHERE genre_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
                return affectedRows > 0;
            });
        }
    }
}

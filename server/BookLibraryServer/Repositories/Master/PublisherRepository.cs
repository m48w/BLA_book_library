using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class PublisherRepository : IPublisherRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public PublisherRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IPublisherModel>> SearchAsync(string? keyword)
        {
            var query = "SELECT publisher_id AS Id, name AS Name FROM dbo.Publishers";
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query += " WHERE name LIKE @Keyword";
            }

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var items = await connection.QueryAsync<PublishersModel>(query, new { Keyword = $"%{keyword}%" });
                return items.Cast<IPublisherModel>();
            });
        }

        public async Task<IPublisherModel?> GetByIdAsync(int id)
        {
            var query = "SELECT publisher_id AS Id, name AS Name FROM dbo.Publishers WHERE publisher_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                return await connection.QueryFirstOrDefaultAsync<PublishersModel>(query, new { Id = id });
            });
        }

        public async Task<IPublisherModel> AddAsync(IPublisherModel publisher)
        {
            var query = @"
INSERT INTO dbo.Publishers (name) VALUES (@Name);
SELECT CAST(SCOPE_IDENTITY() as int);
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var newId = await connection.QuerySingleAsync<int>(query, new { publisher.Name });
                return (await GetByIdAsync(newId))!;
            });
        }

        public async Task<bool> UpdateAsync(IPublisherModel publisher)
        {
            var query = "UPDATE dbo.Publishers SET name = @Name WHERE publisher_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { publisher.Name, publisher.Id });
                return affectedRows > 0;
            });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM dbo.Publishers WHERE publisher_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
                return affectedRows > 0;
            });
        }
    }
}

using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Repositories.Database;
using BookLibraryServer.Models.Database;
using Dapper;

namespace BookLibraryServer.Repositories.Database
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public DashboardRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IDashboardStatsModel> GetStatsAsync()
        {
            var stats = new DashboardStatsModel();

            await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var totalBooksQuery = "SELECT COUNT(*) FROM dbo.Books";
                stats.TotalBooks = await connection.ExecuteScalarAsync<int>(totalBooksQuery);

                var rentedBooksQuery = "SELECT COUNT(*) FROM dbo.Rentals WHERE return_date IS NULL";
                stats.RentedBooks = await connection.ExecuteScalarAsync<int>(rentedBooksQuery);

                var totalUsersQuery = "SELECT COUNT(*) FROM dbo.Users";
                stats.TotalUsers = await connection.ExecuteScalarAsync<int>(totalUsersQuery);

                var recentBooksQuery = @"
SELECT TOP 5
    B.book_id AS Id,
    B.title AS Title,
    B.cover_image_url AS CoverImageUrl,
    STRING_AGG(A.name, ', ') AS AuthorNames
FROM dbo.Books AS B
LEFT JOIN dbo.BookAuthors AS BA ON B.book_id = BA.book_id
LEFT JOIN dbo.Authors AS A ON BA.author_id = A.author_id
GROUP BY B.book_id, B.title, B.cover_image_url, B.created_at
ORDER BY B.created_at DESC
";
                stats.RecentlyAddedBooks = await connection.QueryAsync<BookModel>(recentBooksQuery);

                return true; // Dummy return
            });

            return stats;
        }
    }
}

using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Repositories.Database;
using BookLibraryServer.Models.Database;
using Dapper;

namespace BookLibraryServer.Repositories.Database
{
    public class RentalRepository : IRentalRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public RentalRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IRentalModel> RecordRentalAsync(int bookId, int userId, DateTime rentalDate, DateTime dueDate)
        {
            var query = @"
INSERT INTO dbo.Rentals (book_id, user_id, rental_date, due_date)
VALUES (@BookId, @UserId, @RentalDate, @DueDate);
SELECT CAST(SCOPE_IDENTITY() as int);
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var newId = await connection.QuerySingleAsync<int>(query, new { BookId = bookId, UserId = userId, RentalDate = rentalDate, DueDate = dueDate });
                return (await connection.QueryFirstOrDefaultAsync<RentalModel>("SELECT * FROM dbo.Rentals WHERE rental_id = @Id", new { Id = newId }))!;
            });
        }

        public async Task<IRentalModel?> GetActiveRentalByBookIdAsync(int bookId)
        {
            var query = "SELECT * FROM dbo.Rentals WHERE book_id = @BookId AND return_date IS NULL";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                return await connection.QueryFirstOrDefaultAsync<RentalModel>(query, new { BookId = bookId });
            });
        }

        public async Task<bool> RecordReturnAsync(int rentalId, DateTime returnDate)
        {
            var query = "UPDATE dbo.Rentals SET return_date = @ReturnDate WHERE rental_id = @RentalId";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { RentalId = rentalId, ReturnDate = returnDate });
                return affectedRows > 0;
            });
        }

        public async Task<bool> UpdateBookStatusAsync(int bookId, int newStatusId)
        {
            var query = "UPDATE dbo.Books SET status_id = @NewStatusId WHERE book_id = @BookId";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { BookId = bookId, NewStatusId = newStatusId });
                return affectedRows > 0;
            });
        }
    }
}

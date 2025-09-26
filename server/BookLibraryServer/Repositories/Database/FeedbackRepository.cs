using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Repositories.Database;
using BookLibraryServer.Models.Database;
using Dapper;

namespace BookLibraryServer.Repositories.Database;

public class FeedbackRepository : IFeedbackRepository
{
    private readonly IDbConnectionFactory _dbConnectionFactory;

    public FeedbackRepository(IDbConnectionFactory dbConnectionFactory)
    {
        _dbConnectionFactory = dbConnectionFactory;
    }

    public async Task<IEnumerable<IFeedbackModel>> GetByBookIdAsync(int bookId)
    {
        var query = @"
SELECT
    F.feedback_id AS Id,
    F.book_id AS BookId,
    F.user_id AS UserId,
    U.name AS UserName,
    F.comment AS Comment,
    F.rating AS Rating,
    F.created_at AS CreatedAt
FROM dbo.Feedbacks AS F
JOIN dbo.Users AS U ON F.user_id = U.user_id
WHERE F.book_id = @BookId
ORDER BY F.created_at DESC;
";
        return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
        {
            var feedbacks = await connection.QueryAsync<FeedbackModel>(query, new { BookId = bookId });
            return feedbacks.Cast<IFeedbackModel>();
        });
    }

    public async Task<IFeedbackModel?> CreateAsync(IFeedbackCreateModel feedback)
    {
        return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
        {
            var query = @"
INSERT INTO dbo.Feedbacks (book_id, user_id, comment, rating, created_at, updated_at)
VALUES (@BookId, @UserId, @Comment, @Rating, GETDATE(), GETDATE());
SELECT CAST(SCOPE_IDENTITY() as int);
";
            var newFeedbackId = await connection.QuerySingleAsync<int>(query, feedback);

            var createdFeedback = await connection.QueryFirstOrDefaultAsync<FeedbackModel>(@"
                SELECT
                    F.feedback_id AS Id,
                    F.book_id AS BookId,
                    F.user_id AS UserId,
                    U.name AS UserName,
                    F.comment AS Comment,
                    F.rating AS Rating,
                    F.created_at AS CreatedAt
                FROM dbo.Feedbacks AS F
                JOIN dbo.Users AS U ON F.user_id = U.user_id
                WHERE F.feedback_id = @Id;
            ", new { Id = newFeedbackId });

            return createdFeedback;
        });
    }
}

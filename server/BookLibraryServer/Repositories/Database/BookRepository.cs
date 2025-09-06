using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Repositories.Database;
using BookLibraryServer.Models.Database;
using Dapper;

namespace BookLibraryServer.Repositories.Database
{
    public class BookRepository : IBookRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public BookRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IBookModel>> SearchAsync(string? keyword)
        {
            var query = @"
SELECT
    B.book_id AS Id,
    B.title AS Title,
    P.name AS PublisherName,
    B.publication_date AS PublicationDate,
    B.isbn AS Isbn,
    B.cover_image_url AS CoverImageUrl,
    G.name AS GenreName,
    B.description AS Description,
    B.notes AS Notes,
    B.is_recommended AS IsRecommended,
    S.name AS StatusName,
    STRING_AGG(A.name, ', ') AS AuthorNames
FROM dbo.Books AS B
LEFT JOIN dbo.Publishers AS P ON B.publisher_id = P.publisher_id
LEFT JOIN dbo.Genres AS G ON B.genre_id = G.genre_id
LEFT JOIN dbo.Statuses AS S ON B.status_id = S.status_id
LEFT JOIN dbo.BookAuthors AS BA ON B.book_id = BA.book_id
LEFT JOIN dbo.Authors AS A ON BA.author_id = A.author_id
";

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query += " WHERE B.title LIKE @Keyword OR A.name LIKE @Keyword OR B.isbn LIKE @Keyword";
            }

            query += " GROUP BY B.book_id, B.title, P.name, B.publication_date, B.isbn, B.cover_image_url, G.name, B.description, B.notes, B.is_recommended, S.name";

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var books = await connection.QueryAsync<BookModel>(query, new { Keyword = $"%{keyword}%" });
                return books.Cast<IBookModel>();
            });
        }

        public async Task<IBookModel> AddAsync(BookLibraryServer.Contract.Models.Database.BookCreateModel book)
        {
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                using var transaction = connection.BeginTransaction();
                try
                {
                    var bookInsertQuery = @"
INSERT INTO dbo.Books (title, publisher_id, publication_date, isbn, cover_image_url, genre_id, description, notes, is_recommended, status_id)
VALUES (@Title, @PublisherId, @PublicationDate, @Isbn, @CoverImageUrl, @GenreId, @Description, @Notes, @IsRecommended, @StatusId);
SELECT CAST(SCOPE_IDENTITY() as int);
";
                    var newBookId = await connection.QuerySingleAsync<int>(bookInsertQuery, book, transaction);

                    if (book.AuthorIds != null && book.AuthorIds.Any())
                    {
                        var bookAuthorInsertQuery = "INSERT INTO dbo.BookAuthors (book_id, author_id) VALUES (@BookId, @AuthorId)";
                        var bookAuthors = book.AuthorIds.Select(authorId => new { BookId = newBookId, AuthorId = authorId });
                        await connection.ExecuteAsync(bookAuthorInsertQuery, bookAuthors, transaction);
                    }

                    transaction.Commit();

                    // This is not ideal as it's a separate query outside the transaction,
                    // but for simplicity, we'll re-fetch the created book.
                    // A more optimized approach might construct the book model from the input and new ID.
                    var createdBook = await connection.QueryFirstAsync<BookModel>("""
                        SELECT
                            B.book_id AS Id, B.title AS Title, P.name AS PublisherName, B.publication_date AS PublicationDate,
                            B.isbn AS Isbn, B.cover_image_url AS CoverImageUrl, G.name AS GenreName, B.description AS Description,
                            B.notes AS Notes, B.is_recommended AS IsRecommended, S.name AS StatusName, STRING_AGG(A.name, ', ') AS AuthorNames
                        FROM dbo.Books AS B
                        LEFT JOIN dbo.Publishers AS P ON B.publisher_id = P.publisher_id
                        LEFT JOIN dbo.Genres AS G ON B.genre_id = G.genre_id
                        LEFT JOIN dbo.Statuses AS S ON B.status_id = S.status_id
                        LEFT JOIN dbo.BookAuthors AS BA ON B.book_id = BA.book_id
                        LEFT JOIN dbo.Authors AS A ON BA.author_id = A.author_id
                        WHERE B.book_id = @Id
                        GROUP BY B.book_id, B.title, P.name, B.publication_date, B.isbn, B.cover_image_url, G.name, B.description, B.notes, B.is_recommended, S.name
                        """, new { Id = newBookId });

                    return createdBook;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            });
        }
    }
}

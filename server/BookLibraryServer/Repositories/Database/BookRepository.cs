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

        public async Task<IEnumerable<IBookModel>> SearchAsync(string? keyword, int? genreId)
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

            var conditions = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                conditions.Add("(B.title LIKE @Keyword OR A.name LIKE @Keyword OR B.isbn LIKE @Keyword)");
                parameters.Add("@Keyword", $"%{keyword}%");
            }

            if (genreId.HasValue)
            {
                conditions.Add("B.genre_id = @GenreId");
                parameters.Add("@GenreId", genreId.Value);
            }

            if (conditions.Any())
            {
                query += " WHERE " + string.Join(" AND ", conditions);
            }

            query += " GROUP BY B.book_id, B.title, P.name, B.publication_date, B.isbn, B.cover_image_url, G.name, B.description, B.notes, B.is_recommended, S.name";

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var books = await connection.QueryAsync<BookModel>(query, parameters);
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

        public async Task<IBookModel?> UpdateAsync(int id, BookLibraryServer.Contract.Models.Database.BookCreateModel book)
        {
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                using var transaction = connection.BeginTransaction();
                try
                {
                    // 1. Update the Books table
                    var bookUpdateQuery = @"
UPDATE dbo.Books 
SET 
    title = @Title, 
    publisher_id = @PublisherId, 
    publication_date = @PublicationDate, 
    isbn = @Isbn, 
    cover_image_url = @CoverImageUrl, 
    genre_id = @GenreId, 
    description = @Description, 
    notes = @Notes, 
    is_recommended = @IsRecommended, 
    status_id = @StatusId
WHERE book_id = @Id;";
                    var bookParams = new
                    {
                        Id = id,
                        book.Title,
                        book.PublisherId,
                        book.PublicationDate,
                        book.Isbn,
                        book.CoverImageUrl,
                        book.GenreId,
                        book.Description,
                        book.Notes,
                        book.IsRecommended,
                        book.StatusId
                    };
                    var affectedRows = await connection.ExecuteAsync(bookUpdateQuery, bookParams, transaction);

                    if (affectedRows == 0)
                    {
                        // Book with the given ID not found
                        transaction.Rollback();
                        return null;
                    }

                    // 2. Delete existing author associations
                    var deleteAuthorsQuery = "DELETE FROM dbo.BookAuthors WHERE book_id = @BookId;";
                    await connection.ExecuteAsync(deleteAuthorsQuery, new { BookId = id }, transaction);

                    // 3. Insert new author associations
                    if (book.AuthorIds != null && book.AuthorIds.Any())
                    {
                        var bookAuthorInsertQuery = "INSERT INTO dbo.BookAuthors (book_id, author_id) VALUES (@BookId, @AuthorId);";
                        var bookAuthors = book.AuthorIds.Select(authorId => new { BookId = id, AuthorId = authorId });
                        await connection.ExecuteAsync(bookAuthorInsertQuery, bookAuthors, transaction);
                    }

                    transaction.Commit();

                    // 4. Re-fetch the updated book data to return it
                    var updatedBook = await connection.QueryFirstAsync<BookModel>("""
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
                        """, new { Id = id });

                    return updatedBook;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            });
        }

        public async Task<IEnumerable<IBookModel>> GetRecommendedAsync()
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
WHERE B.is_recommended = 1
GROUP BY B.book_id, B.title, P.name, B.publication_date, B.isbn, B.cover_image_url, G.name, B.description, B.notes, B.is_recommended, S.name";

            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var books = await connection.QueryAsync<BookModel>(query);
                return books.Cast<IBookModel>();
            });
        }
    }
}

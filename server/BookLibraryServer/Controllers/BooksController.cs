using BookLibraryServer.Contract.Logic.Database;
using BookLibraryServer.Contract.Models.Database;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/books")]
    [Produces("application/json")]
    public class BooksController : ControllerBase
    {
        private readonly IBookLogic _bookLogic;

        public BooksController(IBookLogic bookLogic)
        {
            _bookLogic = bookLogic;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] string? keyword, [FromQuery] int? genreId)
        {
            var items = await _bookLogic.SearchAsync(keyword, genreId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] BookCreateModel book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newBook = await _bookLogic.AddAsync(book);
            // Returning the created book with a 201 status code.
            // The location header is omitted for simplicity, but could be added.
            return StatusCode(201, newBook);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookCreateModel book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedBook = await _bookLogic.UpdateAsync(id, book);
            if (updatedBook == null)
            {
                return NotFound();
            }
            return Ok(updatedBook);
        }

        [HttpGet("recommended")]
        public async Task<IActionResult> GetRecommendedBooks()
        {
            var books = await _bookLogic.GetRecommendedAsync();
            return Ok(books);
        }

        [HttpPost("{id}/force-available")]
        public async Task<IActionResult> ForceSetAvailable(int id)
        {
            var result = await _bookLogic.ForceSetAvailableAsync(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}

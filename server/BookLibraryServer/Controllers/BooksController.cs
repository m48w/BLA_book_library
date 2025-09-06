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
        public async Task<IActionResult> GetBooks([FromQuery] string? keyword)
        {
            var items = await _bookLogic.SearchAsync(keyword);
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
    }
}

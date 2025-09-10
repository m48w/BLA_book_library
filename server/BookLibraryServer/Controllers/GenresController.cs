using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Models.Master;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/genres")]
    [Produces("application/json")]
    public class GenresController : ControllerBase
    {
        private readonly IGenreLogic _genreLogic;

        public GenresController(IGenreLogic genreLogic)
        {
            _genreLogic = genreLogic;
        }

        [HttpGet]
        public async Task<IActionResult> GetGenres([FromQuery] string? keyword)
        {
            var items = await _genreLogic.SearchAsync(keyword);
            Console.WriteLine($"GenresController: Retrieved {items.Count()} items.");
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGenreById(int id)
        {
            var item = await _genreLogic.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> AddGenre([FromBody] GenresModel item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            var newItem = await _genreLogic.AddAsync(item);
            return CreatedAtAction(nameof(GetGenreById), new { id = newItem.Id }, newItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGenre(int id, [FromBody] GenresModel item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var result = await _genreLogic.UpdateAsync(id, item);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var result = await _genreLogic.DeleteAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}

using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Models.Master;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/authors")]
    [Produces("application/json")]
    public class AuthorsController : ControllerBase
    {
        private readonly IAuthorLogic _authorLogic;

        public AuthorsController(IAuthorLogic authorLogic)
        {
            _authorLogic = authorLogic;
        }

        [HttpGet]
        public async Task<IActionResult> GetAuthors([FromQuery] string? keyword) // パラメータ追加
        {
            var items = await _authorLogic.SearchAuthorsAsync(keyword); // 呼び出し変更
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAuthorById(int id)
        {
            var item = await _authorLogic.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> AddAuthor([FromBody] AuthorsModel item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            var newItem = await _authorLogic.AddAsync(item);
            return CreatedAtAction(nameof(GetAuthorById), new { id = newItem.Id }, newItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuthor(int id, [FromBody] AuthorsModel item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var result = await _authorLogic.UpdateAsync(id, item);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var result = await _authorLogic.DeleteAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}

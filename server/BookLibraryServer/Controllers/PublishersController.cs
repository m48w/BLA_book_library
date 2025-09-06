using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Models.Master;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/publishers")]
    [Produces("application/json")]
    public class PublishersController : ControllerBase
    {
        private readonly IPublisherLogic _publisherLogic;

        public PublishersController(IPublisherLogic publisherLogic)
        {
            _publisherLogic = publisherLogic;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublishers([FromQuery] string? keyword)
        {
            var items = await _publisherLogic.SearchAsync(keyword);
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPublisherById(int id)
        {
            var item = await _publisherLogic.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> AddPublisher([FromBody] PublishersModel item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            var newItem = await _publisherLogic.AddAsync(item);
            return CreatedAtAction(nameof(GetPublisherById), new { id = newItem.Id }, newItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePublisher(int id, [FromBody] PublishersModel item)
        {
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var result = await _publisherLogic.UpdateAsync(id, item);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePublisher(int id)
        {
            var result = await _publisherLogic.DeleteAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}

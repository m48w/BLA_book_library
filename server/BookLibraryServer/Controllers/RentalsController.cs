using BookLibraryServer.Contract.Logic.Database;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/rentals")]
    [Produces("application/json")]
    public class RentalsController : ControllerBase
    {
        private readonly IRentalLogic _rentalLogic;

        public RentalsController(IRentalLogic rentalLogic)
        {
            _rentalLogic = rentalLogic;
        }

        [HttpPost("borrow")]
        public async Task<IActionResult> BorrowBook([FromQuery] int bookId, [FromQuery] int userId)
        {
            try
            {
                var rental = await _rentalLogic.BorrowBookAsync(bookId, userId);
                return Ok(rental);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("return")]
        public async Task<IActionResult> ReturnBook([FromQuery] int bookId)
        {
            try
            {
                var result = await _rentalLogic.ReturnBookAsync(bookId);
                if (result)
                {
                    return NoContent();
                }
                return NotFound("Active rental not found for this book.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveRentals()
        {
            var rentals = await _rentalLogic.GetActiveRentalsAsync();
            return Ok(rentals);
        }
    }
}

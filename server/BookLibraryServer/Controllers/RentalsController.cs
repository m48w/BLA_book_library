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

        [HttpPost("force-borrow")]
        public async Task<IActionResult> ForceBorrowBook([FromQuery] int bookId, [FromQuery] int userId)
        {
            try
            {
                var rental = await _rentalLogic.ForceBorrowBookAsync(bookId, userId);
                return Ok(rental);
            }
            catch (Exception)
            {
                // Log the exception details here
                return StatusCode(500, "An unexpected error occurred.");
            }
        }

        [HttpPost("extend")]
        public async Task<IActionResult> ExtendRental([FromQuery] int bookId)
        {
            try
            {
                var result = await _rentalLogic.ExtendRentalAsync(bookId);
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
    }
}

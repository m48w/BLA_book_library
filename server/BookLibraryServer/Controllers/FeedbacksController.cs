using BookLibraryServer.Contract.Logic.Database;
using BookLibraryServer.Models.Database;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers;

[ApiController]
[Route("api/v1/books/{bookId}/feedbacks")]
[Produces("application/json")]
public class FeedbacksController : ControllerBase
{
    private readonly IFeedbackLogic _feedbackLogic;

    public FeedbacksController(IFeedbackLogic feedbackLogic)
    {
        _feedbackLogic = feedbackLogic;
    }

    [HttpGet]
    public async Task<IActionResult> GetFeedbacksForBook(int bookId)
    {
        var feedbacks = await _feedbackLogic.GetByBookIdAsync(bookId);
        return Ok(feedbacks);
    }

    [HttpPost]
    public async Task<IActionResult> AddFeedbackForBook(int bookId, [FromBody] FeedbackCreateModel feedback)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Ensure the feedback is being added to the correct book
        feedback.BookId = bookId;

        var newFeedback = await _feedbackLogic.CreateAsync(feedback);
        if (newFeedback == null)
        {
            // This might happen if there's an issue during creation
            return StatusCode(500, "A problem occurred while handling your request.");
        }

        return StatusCode(201, newFeedback);
    }
}

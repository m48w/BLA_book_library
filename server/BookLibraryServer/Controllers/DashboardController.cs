using BookLibraryServer.Contract.Logic.Database;
using Microsoft.AspNetCore.Mvc;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/dashboard")]
    [Produces("application/json")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardLogic _dashboardLogic;

        public DashboardController(IDashboardLogic dashboardLogic)
        {
            _dashboardLogic = dashboardLogic;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _dashboardLogic.GetStatsAsync();
            return Ok(stats);
        }
    }
}

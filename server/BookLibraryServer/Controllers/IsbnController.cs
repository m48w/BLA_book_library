using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text.Json;

namespace BookLibraryServer.Controllers
{
    [ApiController]
    [Route("api/v1/isbn")]
    public class IsbnController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public IsbnController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("{isbn}")]
        public async Task<IActionResult> GetBookInfo(string isbn)
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}";

            try
            {
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Failed to fetch data from Google Books API.");
                }

                var content = await response.Content.ReadAsStringAsync();
                // For simplicity, we are returning the raw JSON from Google Books API.
                // A more robust implementation would parse this into a specific DTO.
                return Content(content, "application/json");
            }
            catch (HttpRequestException e)
            {
                return StatusCode(503, $"Error connecting to Google Books API: {e.Message}");
            }
        }
    }
}

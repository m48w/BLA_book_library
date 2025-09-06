using System.ComponentModel.DataAnnotations;

namespace BookLibraryServer.Models.Database
{
    public class BookCreateModel
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public int? PublisherId { get; set; }

        public DateTime? PublicationDate { get; set; }

        public string? Isbn { get; set; }

        public string? CoverImageUrl { get; set; }

        public int? GenreId { get; set; }

        public string? Description { get; set; }

        public string? Notes { get; set; }

        public bool IsRecommended { get; set; }

        [Required]
        public List<int> AuthorIds { get; set; } = new List<int>();
    }
}

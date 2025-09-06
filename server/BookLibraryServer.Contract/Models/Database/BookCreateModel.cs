using System.ComponentModel.DataAnnotations;

namespace BookLibraryServer.Contract.Models.Database
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

        public int StatusId { get; set; } // Added

        [Required]
        public List<int> AuthorIds { get; set; } = new List<int>();
    }
}

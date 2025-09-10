namespace BookLibraryServer.Contract.Models.Database
{
    public class RentalDisplayModel
    {
        public int RentalId { get; set; }
        public int BookId { get; set; }
        public required string BookTitle { get; set; }
        public string? BookCoverImageUrl { get; set; }
        public int UserId { get; set; }
        public required string UserName { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime DueDate { get; set; }
    }
}

using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Models.Database
{
    public class RentalModel : IRentalModel
    {
        public int RentalId { get; set; }
        public int BookId { get; set; }
        public int UserId { get; set; }
        public DateTime RentalDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
    }
}

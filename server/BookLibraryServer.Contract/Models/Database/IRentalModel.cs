namespace BookLibraryServer.Contract.Models.Database
{
    public interface IRentalModel
    {
        int RentalId { get; }
        int BookId { get; }
        int UserId { get; }
        DateTime RentalDate { get; }
        DateTime DueDate { get; }
        DateTime? ReturnDate { get; }
    }
}

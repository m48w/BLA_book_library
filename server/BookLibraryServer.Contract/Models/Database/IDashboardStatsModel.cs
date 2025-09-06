using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Models.Database
{
    public interface IDashboardStatsModel
    {
        int TotalBooks { get; set; }
        int RentedBooks { get; set; }
        int TotalUsers { get; set; }
        IEnumerable<IBookModel> RecentlyAddedBooks { get; set; }
    }
}

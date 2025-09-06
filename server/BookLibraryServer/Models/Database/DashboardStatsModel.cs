using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Models.Database
{
    public class DashboardStatsModel : IDashboardStatsModel
    {
        public int TotalBooks { get; set; }
        public int RentedBooks { get; set; }
        public int TotalUsers { get; set; }
        public IEnumerable<IBookModel> RecentlyAddedBooks { get; set; } = Enumerable.Empty<IBookModel>();
    }
}

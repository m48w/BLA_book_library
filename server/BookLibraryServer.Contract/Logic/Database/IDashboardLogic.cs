using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Logic.Database
{
    public interface IDashboardLogic
    {
        Task<IDashboardStatsModel> GetStatsAsync();
    }
}

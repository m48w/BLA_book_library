using BookLibraryServer.Contract.Models.Database;

namespace BookLibraryServer.Contract.Repositories.Database
{
    public interface IDashboardRepository
    {
        Task<IDashboardStatsModel> GetStatsAsync();
    }
}

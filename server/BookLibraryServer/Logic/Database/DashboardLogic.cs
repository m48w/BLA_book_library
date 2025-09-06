using BookLibraryServer.Contract.Logic.Database;
using BookLibraryServer.Contract.Models.Database;
using BookLibraryServer.Contract.Repositories.Database;

namespace BookLibraryServer.Logic.Database
{
    public class DashboardLogic : IDashboardLogic
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardLogic(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public async Task<IDashboardStatsModel> GetStatsAsync()
        {
            return await _dashboardRepository.GetStatsAsync();
        }
    }
}

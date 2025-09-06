using BookLibraryServer.Contract.Data;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;
using Dapper;

namespace BookLibraryServer.Repositories.Master
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public DepartmentRepository(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<IEnumerable<IDepartmentModel>> GetAllAsync()
        {
            var query = "SELECT department_id AS Id, name AS Name FROM dbo.Departments";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var departments = await connection.QueryAsync<DepartmentsModel>(query);
                return departments.Cast<IDepartmentModel>();
            });
        }

        public async Task<IDepartmentModel?> GetByIdAsync(int id)
        {
            var query = "SELECT department_id AS Id, name AS Name FROM dbo.Departments WHERE department_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                return await connection.QueryFirstOrDefaultAsync<DepartmentsModel>(query, new { Id = id });
            });
        }

        public async Task<IDepartmentModel> AddAsync(IDepartmentModel department)
        {
            var query = @"
INSERT INTO dbo.Departments (name) VALUES (@Name);
SELECT CAST(SCOPE_IDENTITY() as int);
";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var newId = await connection.QuerySingleAsync<int>(query, new { department.Name });
                return (await GetByIdAsync(newId))!;
            });
        }

        public async Task<bool> UpdateAsync(IDepartmentModel department)
        {
            var query = "UPDATE dbo.Departments SET name = @Name WHERE department_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { department.Name, department.Id });
                return affectedRows > 0;
            });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM dbo.Departments WHERE department_id = @Id";
            return await _dbConnectionFactory.ExecuteAsync(async (connection) =>
            {
                var affectedRows = await connection.ExecuteAsync(query, new { Id = id });
                return affectedRows > 0;
            });
        }
    }
}

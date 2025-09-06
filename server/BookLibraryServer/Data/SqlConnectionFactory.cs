using BookLibraryServer.Contract.Data;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BookLibraryServer.Data
{
    /// <inheritdoc/>
    public class SqlConnectionFactory : IDbConnectionFactory
    {
        private readonly string connectionString;

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="cs">接続文字列</param>
        public SqlConnectionFactory(string cs)
        {
            connectionString = cs;
        }

        private IDbConnection CreateConnection()
        {
            return new SqlConnection(connectionString);
        }

        /// <inheritdoc/>
        public async Task ExecuteAsync(Func<IDbConnection, Task> func)
        {
            using IDbConnection conn = CreateConnection();
            conn.Open();
            try
            {
                await func(conn);
            }
            catch
            {
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<T> ExecuteAsync<T>(Func<IDbConnection, Task<T>> func)
        {
            using IDbConnection conn = CreateConnection();
            conn.Open();
            try
            {
                return await func(conn);
            }
            catch
            {
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task ExecuteWithTransactionAsync(Func<IDbConnection, IDbTransaction, Task> func)
        {
            using IDbConnection conn = CreateConnection();
            conn.Open();
            using IDbTransaction tran = conn.BeginTransaction();
            try
            {
                await func(conn, tran);
            }
            catch
            {
                tran.Rollback();
                throw;
            }
        }

        /// <inheritdoc/>
        public async Task<T> ExecuteWithTransactionAsync<T>(Func<IDbConnection, IDbTransaction, Task<T>> func)
        {
            using IDbConnection conn = CreateConnection();
            conn.Open();
            using IDbTransaction tran = conn.BeginTransaction();
            try
            {
                return await func(conn, tran);
            }
            catch
            {
                tran.Rollback();
                throw;
            }
        }
    }
}

using System.Data;

namespace BookLibraryServer.Contract.Data
{
    /// <summary>
    /// 接続文字列から動的にコネクションを生成するファクトリクラス
    /// </summary>
    public interface IDbConnectionFactory
    {
        /// <summary>
        /// コネクションを生成し、コールバックで処理を行う
        /// </summary>
        /// <param name="func">コネクションを受け取るコールバック</param>
        /// <returns></returns>
        Task ExecuteAsync(Func<IDbConnection, Task> func);
        /// <summary>
        /// コネクションを生成し、コールバックでの処理結果を受け取る
        /// </summary>
        /// <typeparam name="T">戻り値の型</typeparam>
        /// <param name="func">コネクションを受け取るコールバック</param>
        /// <returns>戻り値</returns>
        Task<T> ExecuteAsync<T>(Func<IDbConnection, Task<T>> func);
        /// <summary>
        /// コネクションとトランザクションを生成し、コールバックで処理を行う
        /// </summary>
        /// <param name="func">コネクションとトランザクションを受け取るコールバック</param>
        /// <returns></returns>
        Task ExecuteWithTransactionAsync(Func<IDbConnection, IDbTransaction, Task> func);
        /// <summary>
        /// コネクションとトランザクションを生成し、コールバックでの処理結果を受け取る
        /// </summary>
        /// <typeparam name="T">戻り値の型</typeparam>
        /// <param name="func">コネクションとトランザクションを受け取るコールバック</param>
        /// <returns>戻り値</returns>
        Task<T> ExecuteWithTransactionAsync<T>(Func<IDbConnection, IDbTransaction, Task<T>> func);
    }
}


using BookLibraryServer.Contract.Data;
using BookLibraryServer.Data;

namespace BookLibraryServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            //SQL Connection
            string connectionString = builder.Configuration.GetConnectionString("DefaultDB") ?? "";
            builder.Services.AddSingleton<IDbConnectionFactory>((provider) =>
                new SqlConnectionFactory(connectionString)
            );

            // Repositories
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Master.IAuthorRepository, BookLibraryServer.Repositories.Master.AuthorRepository>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Master.IGenreRepository, BookLibraryServer.Repositories.Master.GenreRepository>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Master.IUserRepository, BookLibraryServer.Repositories.Master.UserRepository>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Master.IDepartmentRepository, BookLibraryServer.Repositories.Master.DepartmentRepository>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Master.IPublisherRepository, BookLibraryServer.Repositories.Master.PublisherRepository>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Database.IBookRepository, BookLibraryServer.Repositories.Database.BookRepository>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Database.IDashboardRepository, BookLibraryServer.Repositories.Database.DashboardRepository>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Repositories.Database.IRentalRepository, BookLibraryServer.Repositories.Database.RentalRepository>();

            // Logic
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Master.IAuthorLogic, BookLibraryServer.Logic.Master.AuthorLogic>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Master.IGenreLogic, BookLibraryServer.Logic.Master.GenreLogic>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Master.IUserLogic, BookLibraryServer.Logic.Master.UserLogic>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Master.IDepartmentLogic, BookLibraryServer.Logic.Master.DepartmentLogic>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Master.IPublisherLogic, BookLibraryServer.Logic.Master.PublisherLogic>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Database.IBookLogic, BookLibraryServer.Logic.Database.BookLogic>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Database.IDashboardLogic, BookLibraryServer.Logic.Database.DashboardLogic>();
            builder.Services.AddScoped<BookLibraryServer.Contract.Logic.Database.IRentalLogic, BookLibraryServer.Logic.Database.RentalLogic>();

            // Add services to the container.
            builder.Services.AddHttpClient();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}

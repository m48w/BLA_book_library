using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;

namespace BookLibraryServer.Logic.Master
{
    public class GenreLogic : IGenreLogic
    {
        private readonly IGenreRepository _genreRepository;

        public GenreLogic(IGenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }

        public async Task<IEnumerable<IGenreModel>> SearchAsync(string? keyword)
        {
            return await _genreRepository.SearchAsync(keyword);
        }

        public async Task<IGenreModel?> GetByIdAsync(int id)
        {
            return await _genreRepository.GetByIdAsync(id);
        }

        public async Task<IGenreModel> AddAsync(IGenreModel genre)
        {
            return await _genreRepository.AddAsync(genre);
        }

        public async Task<bool> UpdateAsync(int id, IGenreModel genre)
        {
            var existing = await _genreRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return false;
            }
            var modelToUpdate = new GenresModel(id, genre.Name);
            return await _genreRepository.UpdateAsync(modelToUpdate);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _genreRepository.DeleteAsync(id);
        }
    }
}

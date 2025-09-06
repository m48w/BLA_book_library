using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;

namespace BookLibraryServer.Logic.Master
{
    public class AuthorLogic : IAuthorLogic
    {
        private readonly IAuthorRepository _authorRepository;

        public AuthorLogic(IAuthorRepository authorRepository)
        {
            _authorRepository = authorRepository;
        }

        public async Task<IEnumerable<IAuthorModel>> GetAllAuthorsAsync()
        {
            return await _authorRepository.GetAllAuthorsAsync();
        }

        public async Task<IEnumerable<IAuthorModel>> SearchAuthorsAsync(string? keyword)
        {
            return await _authorRepository.SearchAuthorsAsync(keyword);
        }

        public async Task<IAuthorModel?> GetByIdAsync(int id)
        {
            return await _authorRepository.GetByIdAsync(id);
        }

        public async Task<IAuthorModel> AddAsync(IAuthorModel author)
        {
            return await _authorRepository.AddAsync(author);
        }

        public async Task<bool> UpdateAsync(int id, IAuthorModel author)
        {
            var existing = await _authorRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return false;
            }
            var modelToUpdate = new AuthorsModel(id, author.Name);
            return await _authorRepository.UpdateAsync(modelToUpdate);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _authorRepository.DeleteAsync(id);
        }
    }
}

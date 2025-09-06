using BookLibraryServer.Contract.Logic.Master;
using BookLibraryServer.Contract.Models.Master;
using BookLibraryServer.Contract.Repositories.Master;
using BookLibraryServer.Models.Master;

namespace BookLibraryServer.Logic.Master
{
    public class PublisherLogic : IPublisherLogic
    {
        private readonly IPublisherRepository _publisherRepository;

        public PublisherLogic(IPublisherRepository publisherRepository)
        {
            _publisherRepository = publisherRepository;
        }

        public async Task<IEnumerable<IPublisherModel>> SearchAsync(string? keyword)
        {
            return await _publisherRepository.SearchAsync(keyword);
        }

        public async Task<IPublisherModel?> GetByIdAsync(int id)
        {
            return await _publisherRepository.GetByIdAsync(id);
        }

        public async Task<IPublisherModel> AddAsync(IPublisherModel publisher)
        {
            return await _publisherRepository.AddAsync(publisher);
        }

        public async Task<bool> UpdateAsync(int id, IPublisherModel publisher)
        {
            var existing = await _publisherRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return false;
            }
            var modelToUpdate = new PublishersModel(id, publisher.Name);
            return await _publisherRepository.UpdateAsync(modelToUpdate);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _publisherRepository.DeleteAsync(id);
        }
    }
}

using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IResourceService
    {
        Task<List<ResourceEntity>> GetResourcesAsync(string? subject, string? level, string? examType, int? year);
        Task<List<ResourceEntity>> GetPastPapersAsync(string? subject, int? year);
    }

    public class ResourceService : IResourceService
    {
        private readonly IExamRepository _examRepository;

        public ResourceService(IExamRepository examRepository)
        {
            _examRepository = examRepository;
        }

        public async Task<List<ResourceEntity>> GetResourcesAsync(string? subject, string? level, string? examType, int? year)
        {
            return await _examRepository.GetResourcesAsync(subject, level, examType, year);
        }

        public async Task<List<ResourceEntity>> GetPastPapersAsync(string? subject, int? year)
        {
            // Assuming past papers are resources with Type = "PastPaper"
            var resources = await _examRepository.GetResourcesAsync(subject, null, null, year);
            return resources.Where(r => r.Type == "PastPaper").ToList();
        }
    }
}

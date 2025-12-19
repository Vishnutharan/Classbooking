using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public class ResourceService : IResourceService
    {
        private readonly IExamRepository _examRepository; // Keeping for existing GetResourcesAsync logic if needed, or better, migrate to ResourceRepository
        private readonly IResourceRepository _resourceRepository;

        public ResourceService(IExamRepository examRepository, IResourceRepository resourceRepository)
        {
            _examRepository = examRepository;
            _resourceRepository = resourceRepository;
        }

        public async Task<List<ResourceEntity>> GetResourcesAsync(string? subject, string? level, string? examType, int? year)
        {
            // Delegating to ExamRepository as before, or could use _resourceRepository if we moved that logic
            return await _examRepository.GetResourcesAsync(subject, level, examType, year);
        }

        public async Task<List<ResourceEntity>> GetPastPapersAsync(string? subject, int? year)
        {
            var resources = await _examRepository.GetResourcesAsync(subject, null, null, year);
            return resources.Where(r => r.Type == "PastPaper").ToList();
        }

        public async Task<ResourceEntity> UploadResourceAsync(ResourceEntity resource)
        {
            return await _resourceRepository.CreateAsync(resource);
        }

        public async Task<List<ResourceEntity>> GetTeacherResourcesAsync(string teacherId)
        {
            return await _resourceRepository.GetByTeacherAsync(teacherId);
        }

        public async Task<List<ResourceEntity>> GetStudentResourcesAsync(string studentId)
        {
            return await _resourceRepository.GetByStudentAsync(studentId);
        }

        public async Task<bool> DeleteResourceAsync(string id)
        {
            return await _resourceRepository.DeleteAsync(id);
        }
    }
}

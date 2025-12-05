using ClassBooking.API.Entities;

namespace ClassBooking.API.Services
{
    public interface IResourceService
    {
        Task<List<ResourceEntity>> GetResourcesAsync(string? subject, string? level, string? examType, int? year);
        Task<List<ResourceEntity>> GetPastPapersAsync(string? subject, int? year);
        Task<ResourceEntity> UploadResourceAsync(ResourceEntity resource);
        Task<List<ResourceEntity>> GetTeacherResourcesAsync(string teacherId);
        Task<List<ResourceEntity>> GetStudentResourcesAsync(string studentId);
        Task<bool> DeleteResourceAsync(string id);
    }
}

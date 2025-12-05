using ClassBooking.API.Entities;

namespace ClassBooking.API.Repositories
{
    public interface IResourceRepository
    {
        Task<ResourceEntity> CreateAsync(ResourceEntity resource);
        Task<List<ResourceEntity>> GetByTeacherAsync(string teacherId);
        Task<List<ResourceEntity>> GetByStudentAsync(string studentId);
        Task<ResourceEntity?> GetByIdAsync(string id);
        Task<bool> DeleteAsync(string id);
        Task IncrementDownloadCountAsync(string id);
    }
}

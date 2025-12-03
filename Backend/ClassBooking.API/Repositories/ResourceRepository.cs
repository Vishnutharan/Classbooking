using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IResourceRepository
    {
        Task<List<ResourceEntity>> GetByTeacherAsync(string teacherId);
        Task<ResourceEntity?> GetByIdAsync(string id);
        Task<ResourceEntity> CreateAsync(ResourceEntity resource);
        Task<ResourceEntity?> UpdateAsync(string id, ResourceEntity resource);
        Task<bool> DeleteAsync(string id);
        Task IncrementDownloadCountAsync(string id);
    }

    public class ResourceRepository : IResourceRepository
    {
        private readonly ClassBookingDbContext _context;

        public ResourceRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<ResourceEntity>> GetByTeacherAsync(string teacherId)
        {
            return await _context.Resources
                .Where(r => r.TeacherProfileId == teacherId)
                .OrderByDescending(r => r.UploadedAt)
                .ToListAsync();
        }

        public async Task<ResourceEntity?> GetByIdAsync(string id)
        {
            return await _context.Resources.FindAsync(id);
        }

        public async Task<ResourceEntity> CreateAsync(ResourceEntity resource)
        {
            resource.Id = Guid.NewGuid().ToString();
            resource.UploadedAt = DateTime.UtcNow;

            await _context.Resources.AddAsync(resource);
            await _context.SaveChangesAsync();
            return resource;
        }

        public async Task<ResourceEntity?> UpdateAsync(string id, ResourceEntity resource)
        {
            var existing = await _context.Resources.FindAsync(id);
            if (existing == null) return null;

            existing.Title = resource.Title;
            existing.Description = resource.Description;
            existing.Type = resource.Type;
            existing.Subject = resource.Subject;
            existing.Level = resource.Level;
            existing.IsPublic = resource.IsPublic;
            existing.Tags = resource.Tags;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return false;

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task IncrementDownloadCountAsync(string id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource != null)
            {
                resource.DownloadCount++;
                await _context.SaveChangesAsync();
            }
        }
    }
}

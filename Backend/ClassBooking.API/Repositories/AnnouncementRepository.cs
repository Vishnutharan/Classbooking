using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IAnnouncementRepository
    {
        Task<List<AnnouncementEntity>> GetAnnouncementsAsync(string? teacherProfileId = null);
        Task<AnnouncementEntity> CreateAnnouncementAsync(AnnouncementEntity announcement);
        Task<AnnouncementEntity?> GetByIdAsync(string id);
        Task<bool> DeleteAnnouncementAsync(string id);
    }

    public class AnnouncementRepository : IAnnouncementRepository
    {
        private readonly ClassBookingDbContext _context;

        public AnnouncementRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<AnnouncementEntity>> GetAnnouncementsAsync(string? teacherProfileId = null)
        {
            var query = _context.Announcements.AsQueryable();

            if (!string.IsNullOrEmpty(teacherProfileId))
            {
                query = query.Where(a => a.TeacherProfileId == teacherProfileId);
            }

            return await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
        }

        public async Task<AnnouncementEntity> CreateAnnouncementAsync(AnnouncementEntity announcement)
        {
            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
            return announcement;
        }

        public async Task<AnnouncementEntity?> GetByIdAsync(string id)
        {
            return await _context.Announcements.FindAsync(id);
        }

        public async Task<bool> DeleteAnnouncementAsync(string id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null) return false;

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

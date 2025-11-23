using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IAnnouncementService
    {
        Task<List<AnnouncementEntity>> GetAnnouncementsAsync(string? teacherProfileId = null);
        Task<AnnouncementEntity> CreateAnnouncementAsync(string teacherProfileId, string title, string content, string targetAudience);
    }

    public class AnnouncementService : IAnnouncementService
    {
        private readonly IAnnouncementRepository _announcementRepository;

        public AnnouncementService(IAnnouncementRepository announcementRepository)
        {
            _announcementRepository = announcementRepository;
        }

        public async Task<List<AnnouncementEntity>> GetAnnouncementsAsync(string? teacherProfileId = null)
        {
            return await _announcementRepository.GetAnnouncementsAsync(teacherProfileId);
        }

        public async Task<AnnouncementEntity> CreateAnnouncementAsync(string teacherProfileId, string title, string content, string targetAudience)
        {
            var announcement = new AnnouncementEntity
            {
                TeacherProfileId = teacherProfileId,
                Title = title,
                Content = content,
                TargetAudience = targetAudience,
                CreatedAt = DateTime.UtcNow
            };
            return await _announcementRepository.CreateAnnouncementAsync(announcement);
        }
    }
}

using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface INotificationService
    {
        Task<List<NotificationEntity>> GetUserNotificationsAsync(string userId);
        Task<NotificationEntity> SendNotificationAsync(string userId, string title, string message, string type);
        Task MarkAsReadAsync(string notificationId);
    }

    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<List<NotificationEntity>> GetUserNotificationsAsync(string userId)
        {
            return await _notificationRepository.GetByUserIdAsync(userId);
        }

        public async Task<NotificationEntity> SendNotificationAsync(string userId, string title, string message, string type)
        {
            var notification = new NotificationEntity
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };
            return await _notificationRepository.CreateAsync(notification);
        }

        public async Task MarkAsReadAsync(string notificationId)
        {
            await _notificationRepository.MarkAsReadAsync(notificationId);
        }
    }
}

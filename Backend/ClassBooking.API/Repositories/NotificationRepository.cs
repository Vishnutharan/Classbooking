using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface INotificationRepository
    {
        Task<List<NotificationEntity>> GetByUserIdAsync(string userId, bool? isRead = null);
        Task<NotificationEntity> CreateAsync(NotificationEntity notification);
        Task<NotificationEntity?> GetByIdAsync(string id);
        Task<NotificationEntity> UpdateAsync(NotificationEntity notification);
        Task MarkAsReadAsync(string id);
        Task MarkAllAsReadAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId);
    }

    public class NotificationRepository : INotificationRepository
    {
        private readonly ClassBookingDbContext _context;

        public NotificationRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<NotificationEntity>> GetByUserIdAsync(string userId, bool? isRead = null)
        {
            var query = _context.Notifications.Where(n => n.UserId == userId);

            if (isRead.HasValue)
                query = query.Where(n => n.IsRead == isRead.Value);

            return await query
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<NotificationEntity> CreateAsync(NotificationEntity notification)
        {
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task<NotificationEntity?> GetByIdAsync(string id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task<NotificationEntity> UpdateAsync(NotificationEntity notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task MarkAsReadAsync(string id)
        {
            var notification = await GetByIdAsync(id);
            if (notification != null)
            {
                notification.IsRead = true;
                await UpdateAsync(notification);
            }
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await _context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }
    }
}

using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IMessageRepository
    {
        Task<List<MessageEntity>> GetMessagesAsync(string userId);
        Task<List<MessageEntity>> GetConversationAsync(string userId1, string userId2);
        Task<MessageEntity> SendMessageAsync(MessageEntity message);
        Task MarkAsReadAsync(string messageId);
        Task<int> GetUnreadCountAsync(string userId);
    }

    public class MessageRepository : IMessageRepository
    {
        private readonly ClassBookingDbContext _context;

        public MessageRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<MessageEntity>> GetMessagesAsync(string userId)
        {
            return await _context.Messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<List<MessageEntity>> GetConversationAsync(string userId1, string userId2)
        {
            return await _context.Messages
                .Where(m => (m.SenderId == userId1 && m.ReceiverId == userId2) || 
                            (m.SenderId == userId2 && m.ReceiverId == userId1))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<MessageEntity> SendMessageAsync(MessageEntity message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task MarkAsReadAsync(string messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message != null)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await _context.Messages
                .CountAsync(m => m.ReceiverId == userId && !m.IsRead);
        }
    }
}

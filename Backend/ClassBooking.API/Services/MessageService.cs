using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IMessageService
    {
        Task<List<MessageEntity>> GetMyMessagesAsync(string userId);
        Task<List<MessageEntity>> GetConversationAsync(string userId1, string userId2);
        Task<MessageEntity> SendMessageAsync(string senderId, string receiverId, string content);
    }

    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;

        public MessageService(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public async Task<List<MessageEntity>> GetMyMessagesAsync(string userId)
        {
            return await _messageRepository.GetMessagesAsync(userId);
        }

        public async Task<List<MessageEntity>> GetConversationAsync(string userId1, string userId2)
        {
            return await _messageRepository.GetConversationAsync(userId1, userId2);
        }

        public async Task<MessageEntity> SendMessageAsync(string senderId, string receiverId, string content)
        {
            var message = new MessageEntity
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };
            return await _messageRepository.SendMessageAsync(message);
        }
    }
}

using ClassBooking.API.Models;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IMessageService
    {
        Task<List<ConversationDto>> GetConversationsAsync(string userId);
        Task<List<MessageDto>> GetMessagesAsync(string conversationId);
        Task<MessageDto> SendMessageAsync(string conversationId, string senderId, string senderName, string content);
        Task<ConversationDto> CreateConversationAsync(string userId1, string userName1, string role1,
            string userId2, string userName2, string role2, string subject);
        Task MarkAsReadAsync(string conversationId, string userId);
    }

    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;

        public MessageService(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public async Task<List<ConversationDto>> GetConversationsAsync(string userId)
        {
            return await _messageRepository.GetConversationsAsync(userId);
        }

        public async Task<List<MessageDto>> GetMessagesAsync(string conversationId)
        {
            return await _messageRepository.GetMessagesAsync(conversationId);
        }

        public async Task<MessageDto> SendMessageAsync(string conversationId, string senderId, string senderName, string content)
        {
            return await _messageRepository.SendMessageAsync(conversationId, senderId, senderName, content);
        }

        public async Task<ConversationDto> CreateConversationAsync(string userId1, string userName1, string role1,
            string userId2, string userName2, string role2, string subject)
        {
            return await _messageRepository.CreateConversationAsync(userId1, userName1, role1, userId2, userName2, role2, subject);
        }

        public async Task MarkAsReadAsync(string conversationId, string userId)
        {
            await _messageRepository.MarkAsReadAsync(conversationId, userId);
        }
    }
}

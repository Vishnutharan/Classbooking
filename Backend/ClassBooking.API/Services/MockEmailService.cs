using Microsoft.Extensions.Logging;

namespace ClassBooking.API.Services
{
    public class MockEmailService : IEmailService
    {
        private readonly ILogger<MockEmailService> _logger;

        public MockEmailService(ILogger<MockEmailService> logger)
        {
            _logger = logger;
        }

        public Task SendEmailAsync(string to, string subject, string body)
        {
            _logger.LogInformation("================= EMAIL SENT =================");
            _logger.LogInformation($"To: {to}");
            _logger.LogInformation($"Subject: {subject}");
            _logger.LogInformation($"Body: {body}");
            _logger.LogInformation("==============================================");
            return Task.CompletedTask;
        }
    }
}

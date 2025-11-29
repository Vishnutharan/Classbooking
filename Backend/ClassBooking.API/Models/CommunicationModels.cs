namespace ClassBooking.API.Models
{
    // Communication DTOs
    public class ConversationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public List<ParticipantDto> Participants {get; set; } = new List<ParticipantDto>();
        public MessageDto? LastMessage { get; set; }
        public int UnreadCount { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class ParticipantDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class MessageDto
    {
        public string Id { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
    }

    // Analytics DTOs
    public class TeacherAnalyticsDto
    {
        public int TotalStudents { get; set; }
        public int CompletedClasses { get; set; }
        public double AverageRating { get; set; }
        public int AverageAttendance { get; set; }
    }

    public class EarningsAnalyticsDto
    {
        public double TotalEarnings { get; set; }
        public double ProjectedEarnings { get; set; }
        public double AverageHourlyRate { get; set; }
        public int TotalHoursTeaching { get; set; }
        public List<SubjectEarningsDto> EarningsBySubject { get; set; } = new List<SubjectEarningsDto>();
    }

    public class SubjectEarningsDto
    {
        public string Subject { get; set; } = string.Empty;
        public double Earnings { get; set; }
        public int Percentage { get; set; }
    }

    public class SubjectPerformanceDto
    {
        public string Subject { get; set; } = string.Empty;
        public int TotalStudents { get; set; }
        public double AverageScore { get; set; }
        public double PassRate { get; set; }
        public double StudentSatisfaction { get; set; }
    }
}

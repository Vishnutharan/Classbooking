namespace ClassBooking.API.Models
{
    public class ClassBooking
    {
        public string Id { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public string TeacherId { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
        public string ClassType { get; set; } = "OneTime"; // OneTime, Recurring
        public List<string>? RecurringDays { get; set; }
        public string? Notes { get; set; }
        public string? MeetingLink { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class BookingRequest
    {
        public string TeacherId { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
        public string ClassType { get; set; } = "OneTime";
        public string? Notes { get; set; }
    }

    public class BookingResponse
    {
        public string Id { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}

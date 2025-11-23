namespace ClassBooking.API.Models
{
    public class StudentProfile
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProfilePicture { get; set; }
        public string GradeLevel { get; set; } = "OLevel"; // Primary, OLevel, ALevel
        public string? School { get; set; }
        public List<string> FocusAreas { get; set; } = new();
        public List<string> TargetExams { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class SubjectPerformance
    {
        public string Subject { get; set; } = string.Empty;
        public int AverageScore { get; set; }
        public int TotalClasses { get; set; }
        public int StudyHours { get; set; }
        public DateTime? LastClassDate { get; set; }
        public string PerformanceLevel { get; set; } = "Average"; // Excellent, Good, Average, NeedsImprovement
        public List<string> WeakAreas { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
    }

    public class StudyGoal
    {
        public string Id { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime TargetDate { get; set; }
        public string? Subject { get; set; }
        public string GoalType { get; set; } = "Other"; // StudyHours, ChapterCompletion, MockExam, PastPaper, Other
        public int? TargetValue { get; set; }
        public int? CurrentValue { get; set; }
        public string Status { get; set; } = "NotStarted"; // NotStarted, InProgress, Completed, Overdue
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

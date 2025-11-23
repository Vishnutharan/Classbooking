using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClassBooking.API.Entities
{
    [Table("Bookings")]
    public class BookingEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        [Required]
        public string TeacherId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public DateTime Date { get; set; }
        
        [Required]
        public string StartTime { get; set; } = string.Empty;
        
        [Required]
        public string EndTime { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
        
        [Required]
        [MaxLength(50)]
        public string ClassType { get; set; } = "OneTime"; // OneTime, Recurring
        
        public string? RecurringDaysJson { get; set; } // JSON array of days
        
        [MaxLength(2000)]
        public string? Notes { get; set; }
        
        [MaxLength(500)]
        public string? MeetingLink { get; set; }
        
        [MaxLength(2000)]
        public string? CancellationReason { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("StudentProfiles")]
    public class StudentProfileEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
        
        public string? ProfilePicture { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string GradeLevel { get; set; } = "OLevel"; // Primary, OLevel, ALevel
        
        public int? SpecificGrade { get; set; } // 1-13 for Sri Lankan system
        
        [MaxLength(50)]
        public string? Stream { get; set; } // Science, Commerce, Arts, Technology
        
        [MaxLength(200)]
        public string? School { get; set; }
        
        public string? FocusAreasJson { get; set; } // JSON array
        
        public string? TargetExamsJson { get; set; } // JSON array
        
        public int? ExamYear { get; set; }
        
        [MaxLength(200)]
        public string? TargetUniversity { get; set; }
        
        [MaxLength(50)]
        public string? Medium { get; set; } // Sinhala, Tamil, English
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("StudyGoals")]
    public class StudyGoalEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        public DateTime TargetDate { get; set; }
        
        [MaxLength(200)]
        public string? Subject { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string GoalType { get; set; } = "Other"; // StudyHours, ChapterCompletion, MockExam, PastPaper, Other
        
        public double? TargetValue { get; set; }
        
        public double? CurrentValue { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "NotStarted"; // NotStarted, InProgress, Completed, Overdue
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("ExamResults")]
    public class ExamResultEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string ExamType { get; set; } = string.Empty; // OLevel, ALevel, Scholarship, Term
        
        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;
        
        public double Score { get; set; }
        
        public double MaxScore { get; set; } = 100;
        
        [MaxLength(10)]
        public string? Grade { get; set; } // A, B, C, etc.
        
        public DateTime ExamDate { get; set; }
        
        [MaxLength(50)]
        public string? Term { get; set; } // Term 1, Term 2, etc.
        
        public int? Year { get; set; }
        
        [MaxLength(1000)]
        public string? Remarks { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("FeeTransactions")]
    public class FeeTransactionEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        public string? BookingId { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = "LKR";
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Paid, Failed, Refunded
        
        [MaxLength(100)]
        public string? PaymentMethod { get; set; } // Cash, Card, Bank Transfer, etc.
        
        public DateTime? TransactionDate { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(200)]
        public string? TransactionReference { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("Notifications")]
    public class NotificationEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Type { get; set; } = string.Empty; // BookingConfirmed, BookingCancelled, NewMessage, etc.
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(1000)]
        public string Message { get; set; } = string.Empty;
        
        public bool IsRead { get; set; } = false;
        
        public string? RelatedEntityId { get; set; }
        
        [MaxLength(500)]
        public string? ActionUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("Messages")]
    public class MessageEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string SenderId { get; set; } = string.Empty;
        
        [Required]
        public string ReceiverId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(5000)]
        public string Content { get; set; } = string.Empty;
        
        public bool IsRead { get; set; } = false;
        
        public string? AttachmentUrl { get; set; }
        
        [MaxLength(200)]
        public string? Subject { get; set; }
        
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("Announcements")]
    public class AnnouncementEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(5000)]
        public string Content { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string TargetAudience { get; set; } = "All"; // All, Specific
        
        public string? TargetStudentIdsJson { get; set; } // JSON array of student IDs
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("Resources")]
    public class ResourceEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // Video, PDF, Quiz, Notes, PastPaper
        
        [Required]
        public string Url { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [MaxLength(200)]
        public string? Subject { get; set; }
        
        [MaxLength(50)]
        public string? Level { get; set; }
        
        [MaxLength(50)]
        public string? ExamType { get; set; }
        
        public int? Year { get; set; }
        
        public string? UploadedBy { get; set; }
        
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("ExamPreparations")]
    public class ExamPreparationEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        [MaxLength(100)]
        public string ExamType { get; set; } = string.Empty; // OLevel, ALevel, Scholarship
        
        [Required]
        [MaxLength(200)]
        public string Subject { get; set; } = string.Empty;
        
        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        public string? ResourceIdsJson { get; set; } // JSON array of resource IDs
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

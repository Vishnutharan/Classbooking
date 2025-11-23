using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClassBooking.API.Entities
{
    [Table("AttendanceRecords")]
    public class AttendanceRecordEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        [Required]
        public string ClassId { get; set; } = string.Empty;
        
        public DateTime ClassDate { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Present"; // Present, Absent, Late, Excused
        
        [MaxLength(1000)]
        public string? Notes { get; set; }
        
        public string? Subject { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("LessonPlans")]
    public class LessonPlanEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Subject { get; set; } = string.Empty;
        
        [Required]
        public string Level { get; set; } = string.Empty;
        
        public DateTime ScheduledDate { get; set; }
        
        [MaxLength(5000)]
        public string? Description { get; set; }
        
        [MaxLength(2000)]
        public string? LearningObjectives { get; set; }
        
        [MaxLength(5000)]
        public string? Materials { get; set; }
        
        [MaxLength(5000)]
        public string? Activities { get; set; }
        
        [MaxLength(2000)]
        public string? Assessment { get; set; }
        
        [MaxLength(2000)]
        public string? Homework { get; set; }
        
        public int DurationMinutes { get; set; }
        
        [MaxLength(50)]
        public string Status { get; set; } = "Draft"; // Draft, Published, Completed
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
    
    [Table("TeacherStudents")]
    public class TeacherStudentEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        public string StudentName { get; set; } = string.Empty;
        
        public string? Subject { get; set; }
        
        public string? Grade { get; set; }
        
        public DateTime EnrolledDate { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
    }
}

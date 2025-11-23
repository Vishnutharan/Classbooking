using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ClassBooking.API.Models;

namespace ClassBooking.API.Entities
{
    [Table("TeacherProfiles")]
    public class TeacherProfileEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;
        
        public string? ProfilePicture { get; set; }
        
        [MaxLength(2000)]
        public string? Bio { get; set; }
        
        public decimal HourlyRate { get; set; }
        
        public int ExperienceYears { get; set; }
        
        public double AverageRating { get; set; }
        
        public int TotalReviews { get; set; }
        
        public int TotalClasses { get; set; }
        
        public bool IsAvailable { get; set; } = true;
        
        [MaxLength(50)]
        public string VerificationStatus { get; set; } = "Pending"; // Pending, Verified, Rejected
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<TeacherQualificationEntity> Qualifications { get; set; } = new List<TeacherQualificationEntity>();
        public ICollection<TeacherSubjectEntity> Subjects { get; set; } = new List<TeacherSubjectEntity>();
        public ICollection<TeacherAvailabilityEntity> Availability { get; set; } = new List<TeacherAvailabilityEntity>();
        public ICollection<ReviewEntity> Reviews { get; set; } = new List<ReviewEntity>();
    }
    
    [Table("TeacherQualifications")]
    public class TeacherQualificationEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [ForeignKey("TeacherProfileId")]
        public TeacherProfileEntity? TeacherProfile { get; set; }
        
        [Required]
        [MaxLength(500)]
        public string Qualification { get; set; } = string.Empty;
    }
    
    [Table("TeacherSubjects")]
    public class TeacherSubjectEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [ForeignKey("TeacherProfileId")]
        public TeacherProfileEntity? TeacherProfile { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Medium { get; set; } = "English"; // Sinhala, Tamil, English
        
        [Required]
        [MaxLength(50)]
        public string Level { get; set; } = "OLevel"; // Primary, OLevel, ALevel, Secondary, Advanced
    }
    
    [Table("TeacherAvailabilities")]
    public class TeacherAvailabilityEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [ForeignKey("TeacherProfileId")]
        public TeacherProfileEntity? TeacherProfile { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string DayOfWeek { get; set; } = string.Empty;
        
        [Required]
        public string StartTime { get; set; } = string.Empty;
        
        [Required]
        public string EndTime { get; set; } = string.Empty;
    }
    
    [Table("Reviews")]
    public class ReviewEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Required]
        public string TeacherProfileId { get; set; } = string.Empty;
        
        [ForeignKey("TeacherProfileId")]
        public TeacherProfileEntity? TeacherProfile { get; set; }
        
        [Required]
        public string StudentId { get; set; } = string.Empty;
        
        public string StudentName { get; set; } = string.Empty;
        
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [MaxLength(2000)]
        public string? Comment { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

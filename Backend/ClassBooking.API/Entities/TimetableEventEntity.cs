using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClassBooking.API.Entities
{
    [Table("TimetableEvents")]
    public class TimetableEventEntity
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public string StartTime { get; set; } = "00:00";

        [Required]
        public string EndTime { get; set; } = "00:00";

        [MaxLength(50)]
        public string Type { get; set; } = "General"; // Holiday, Exam, Event, General

        [MaxLength(50)]
        public string Audience { get; set; } = "All"; // All, Teachers, Students

        [MaxLength(100)]
        public string? CreatedBy { get; set; } // admin id

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

using System;

namespace ClassBooking.API.Models
{
    public class User
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Student"; // Student, Teacher, Admin
        public string? ProfilePicture { get; set; }
        public string? Bio { get; set; }
        public string? PhoneNumber { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLogin { get; set; }
    }
}

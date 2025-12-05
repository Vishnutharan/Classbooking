namespace ClassBooking.API.Models
{
    public class TeacherStudentDto
    {
        public string Id { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string ProfilePicture { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public List<string> Subjects { get; set; } = new List<string>();
        public DateTime EnrolledDate { get; set; }
        public bool IsActive { get; set; }
        
        // New fields
        public string School { get; set; } = string.Empty;
        public string ParentName { get; set; } = string.Empty;
        public string ParentContact { get; set; } = string.Empty;
    }
}

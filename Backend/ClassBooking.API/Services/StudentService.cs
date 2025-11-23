using ClassBooking.API.Models;

namespace ClassBooking.API.Services
{
    public interface IStudentService
    {
        Task<StudentProfile> GetProfileAsync(string userId);
        Task<List<SubjectPerformance>> GetProgressAsync(string userId);
        Task<List<StudyGoal>> GetStudyGoalsAsync(string userId);
    }

    public class StudentService : IStudentService
    {
        // Mock Data
        private static readonly List<StudentProfile> _profiles = new()
        {
            new StudentProfile
            {
                Id = "student-1",
                UserId = "1", // Matches the mock user ID from AuthService if possible, or just generic
                FullName = "John Doe",
                Email = "john@example.com",
                GradeLevel = "ALevel",
                FocusAreas = new List<string> { "Physics", "Chemistry" },
                TargetExams = new List<string> { "A/L 2025" }
            }
        };

        private static readonly List<SubjectPerformance> _performance = new()
        {
            new SubjectPerformance { Subject = "Mathematics", AverageScore = 78, TotalClasses = 12, StudyHours = 24, PerformanceLevel = "Good" },
            new SubjectPerformance { Subject = "Physics", AverageScore = 65, TotalClasses = 10, StudyHours = 18, PerformanceLevel = "Average" }
        };

        private static readonly List<StudyGoal> _goals = new()
        {
            new StudyGoal { Id = "goal-1", Title = "Complete Physics Chapter 5", TargetDate = DateTime.Now.AddDays(7), Status = "InProgress", CurrentValue = 65, TargetValue = 100 }
        };

        public Task<StudentProfile> GetProfileAsync(string userId)
        {
            // For demo, just return the first profile or create a default one
            var profile = _profiles.FirstOrDefault() ?? new StudentProfile
            {
                Id = "student-" + userId,
                UserId = userId,
                FullName = "Demo Student",
                Email = "student@demo.com"
            };
            return Task.FromResult(profile);
        }

        public Task<List<SubjectPerformance>> GetProgressAsync(string userId)
        {
            return Task.FromResult(_performance);
        }

        public Task<List<StudyGoal>> GetStudyGoalsAsync(string userId)
        {
            return Task.FromResult(_goals);
        }
    }
}

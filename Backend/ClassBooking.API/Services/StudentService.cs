using ClassBooking.API.Models;
using ClassBooking.API.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ClassBooking.API.Services
{
    public interface IStudentService
    {
        Task<StudentProfile> GetProfileAsync(string userId);
        Task<List<SubjectPerformance>> GetProgressAsync(string userId);
        Task<List<StudyGoal>> GetStudyGoalsAsync(string userId);
        Task<List<Entities.ReviewEntity>> GetStudentReviewsAsync(string studentId);
        Task SubmitReviewAsync(Entities.ReviewEntity review);
        Task UpdateReviewAsync(string reviewId, string studentId, int rating, string comment);
    }

    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IExamRepository _examRepository;
        private readonly IFeeRepository _feeRepository;
        private readonly Data.ClassBookingDbContext _context;

        public StudentService(
            IStudentRepository studentRepository,
            IExamRepository examRepository,
            IFeeRepository feeRepository,
            Data.ClassBookingDbContext context)
        {
            _studentRepository = studentRepository;
            _examRepository = examRepository;
            _feeRepository = feeRepository;
            _context = context;
        }

        public async Task<StudentProfile> GetProfileAsync(string userId)
        {
            var entity = await _studentRepository.GetByUserIdAsync(userId);
            if (entity == null) return null;

            return new StudentProfile
            {
                Id = entity.Id,
                UserId = entity.UserId,
                FullName = entity.FullName,
                Email = entity.Email,
                PhoneNumber = entity.PhoneNumber,
                GradeLevel = entity.GradeLevel,
                FocusAreas = !string.IsNullOrEmpty(entity.FocusAreasJson) 
                    ? JsonSerializer.Deserialize<List<string>>(entity.FocusAreasJson) 
                    : new List<string>(),
                TargetExams = !string.IsNullOrEmpty(entity.TargetExamsJson)
                    ? JsonSerializer.Deserialize<List<string>>(entity.TargetExamsJson)
                    : new List<string>()
            };
        }

        public async Task<List<SubjectPerformance>> GetProgressAsync(string userId)
        {
            var student = await _studentRepository.GetByUserIdAsync(userId);
            if (student == null) return new List<SubjectPerformance>();

            var results = await _examRepository.GetResultsByStudentAsync(student.Id);
            
            // Group by subject and calculate average
            return results.GroupBy(r => r.Subject)
                .Select(g => new SubjectPerformance
                {
                    Subject = g.Key,
                    AverageScore = (int)g.Average(r => r.Score),
                    TotalClasses = 0, // Need BookingRepository to calculate this real value
                    StudyHours = 0,   // Need BookingRepository
                    PerformanceLevel = CalculatePerformanceLevel(g.Average(r => r.Score))
                }).ToList();
        }

        public async Task<List<StudyGoal>> GetStudyGoalsAsync(string userId)
        {
            var student = await _studentRepository.GetByUserIdAsync(userId);
            if (student == null) return new List<StudyGoal>();

            var entities = await _studentRepository.GetStudyGoalsAsync(student.Id);
            
            return entities.Select(e => new StudyGoal
            {
                Id = e.Id,
                StudentId = e.StudentId,
                Title = e.Title,
                Description = e.Description,
                TargetDate = e.TargetDate,
                Subject = e.Subject,
                GoalType = e.GoalType,
                TargetValue = (int?)e.TargetValue,
                CurrentValue = (int?)e.CurrentValue,
                Status = e.Status,
                CreatedAt = e.CreatedAt,
                UpdatedAt = e.UpdatedAt
            }).ToList();
        }

        private string CalculatePerformanceLevel(double score)
        {
            if (score >= 75) return "Excellent";
            if (score >= 60) return "Good";
            if (score >= 40) return "Average";
            return "Needs Improvement";
        }

        // Review methods
        public async Task<List<Entities.ReviewEntity>> GetStudentReviewsAsync(string studentId)
        {
            return await _context.Reviews
                .Include(r => r.TeacherProfile)
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task SubmitReviewAsync(Entities.ReviewEntity review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateReviewAsync(string reviewId, string studentId, int rating, string comment)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.Id == reviewId && r.StudentId == studentId);
            
            if (review != null)
            {
                review.Rating = rating;
                review.Comment = comment;
                await _context.SaveChangesAsync();
            }
        }
    }
}

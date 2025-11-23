using ClassBooking.API.Models;
using ClassBooking.API.Services;
using ClassBooking.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ClassBooking.API.Controllers
{
    [Route("api/students")]
    [ApiController]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        private readonly IStudentRepository _studentRepository;
        private readonly ITeacherRepository _teacherRepository;

        public StudentController(
            IStudentService studentService,
            IStudentRepository studentRepository,
            ITeacherRepository teacherRepository)
        {
            _studentService = studentService;
            _studentRepository = studentRepository;
            _teacherRepository = teacherRepository;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<StudentProfile>> GetProfile()
        {
            var userId = User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException();
            var profileEntity = await _studentRepository.GetByUserIdAsync(userId);
            
            if (profileEntity == null)
                return NotFound();
            
            var profile = new StudentProfile
            {
                Id = profileEntity.Id,
                UserId = profileEntity.UserId,
                FullName = profileEntity.FullName,
                Email = profileEntity.Email,
                PhoneNumber = profileEntity.PhoneNumber
            };
            
            return Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<StudentProfile>> UpdateProfile([FromBody] StudentProfile profile)
        {
            var userId = User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException();
            
            var existing = await _studentRepository.GetByUserIdAsync(userId);
            if (existing == null)
                return NotFound();
            
            existing.FullName = profile.FullName;
            existing.PhoneNumber = profile.PhoneNumber;
            existing.UpdatedAt = DateTime.UtcNow;
            
            var updated = await _studentRepository.UpdateAsync(existing);
            
            profile.Id = updated.Id;
            profile.UserId = updated.UserId;
            
            return Ok(profile);
        }

        [HttpGet("recommended-teachers")]
        public async Task<ActionResult<List<TeacherProfile>>> GetRecommendedTeachers()
        {
            // For now, return top-rated teachers as recommendations
            var teachers = await _teacherRepository.GetTopRatedTeachersAsync(5);
            
            var teacherProfiles = teachers.Select(t => new TeacherProfile
            {
                Id = t.Id,
                UserId = t.UserId,
                FullName = t.FullName,
                Email = t.Email,
                PhoneNumber = t.PhoneNumber,
                ProfilePicture = t.ProfilePicture,
                Bio = t.Bio,
                HourlyRate = t.HourlyRate,
                AverageRating = t.AverageRating,
                TotalReviews = t.TotalReviews,
                Subjects = t.Subjects.Select(s => new TeacherSubject
                {
                    Id = s.Id,
                    Name = s.Name,
                    Level = s.Level,
                    Medium = s.Medium
                }).ToList(),
                Availability = t.Availability.Select(a => new TeacherAvailability
                {
                    DayOfWeek = a.DayOfWeek,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime
                }).ToList()
            }).ToList();
            
            return Ok(teacherProfiles);
        }

        [HttpGet("exam-preparations")]
        public async Task<ActionResult<List<ExamPreparation>>> GetExamPreparations([FromQuery] string? examType)
        {
            // Return empty list for now - will be implemented with exam service
            return Ok(new List<ExamPreparation>());
        }

        [HttpGet("study-materials")]
        public async Task<ActionResult<List<Resource>>> GetStudyMaterials([FromQuery] string? subject)
        {
            // Return empty list for now - will be implemented with resource service
            return Ok(new List<Resource>());
        }

        [HttpGet("past-papers")]
        public async Task<ActionResult<List<Resource>>> GetPastPapers([FromQuery] string? subject, [FromQuery] int? year)
        {
            // Return empty list for now - will be implemented with resource service
            return Ok(new List<Resource>());
        }

        [HttpGet("progress")]
        public async Task<ActionResult<object>> GetProgress()
        {
            var userId = User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException();
            
            // Return mock data for now
            return Ok(new
            {
                OverallProgress = 75,
                SubjectsProgress = new[] {
                    new { Subject = "Mathematics", Progress = 80 },
                    new { Subject = "Science", Progress = 70 }
                }
            });
        }

        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetSummary()
        {
            var userId = User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException();
            
            // Return mock data for now
            return Ok(new
            {
                TotalClasses = 0,
                UpcomingClasses = 0,
                CompletedClasses = 0,
                StudyHours = 0
            });
        }

        [HttpGet("study-goals")]
        public async Task<ActionResult<List<StudyGoal>>> GetStudyGoals()
        {
            var userId = User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException();
            var profile = await _studentRepository.GetByUserIdAsync(userId);
            
            if (profile == null)
                return Ok(new List<StudyGoal>());
            
            var goals = await _studentRepository.GetStudyGoalsAsync(profile.Id);
            
            return Ok(goals.Select(g => new StudyGoal
            {
                Id = g.Id,
                StudentId = g.StudentId,
                Title = g.Title,
                Description = g.Description,
                TargetDate = g.TargetDate,
                Subject = g.Subject,
                GoalType = g.GoalType,
                TargetValue = (int?)g.TargetValue,
                CurrentValue = (int?)g.CurrentValue,
                Status = g.Status,
                CreatedAt = g.CreatedAt,
                UpdatedAt = g.UpdatedAt
            }).ToList());
        }

        [HttpPost("study-goals")]
        public async Task<ActionResult<StudyGoal>> CreateStudyGoal([FromBody] StudyGoal goal)
        {
            var userId = User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException();
            var profile = await _studentRepository.GetByUserIdAsync(userId);
            
            if (profile == null)
                return NotFound("Student profile not found");
            
            var goalEntity = new Entities.StudyGoalEntity
            {
                Id = Guid.NewGuid().ToString(),
                StudentId = profile.Id,
                Title = goal.Title,
                Description = goal.Description,
                TargetDate = goal.TargetDate,
                Subject = goal.Subject,
                GoalType = goal.GoalType,
                TargetValue = goal.TargetValue,
                CurrentValue = goal.CurrentValue,
                Status = goal.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            
            var created = await _studentRepository.CreateStudyGoalAsync(goalEntity);
            
            goal.Id = created.Id;
            goal.CreatedAt = created.CreatedAt;
            goal.UpdatedAt = created.UpdatedAt;
            
            return Ok(goal);
        }
    }
}

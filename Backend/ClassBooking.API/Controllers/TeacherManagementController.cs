using ClassBooking.API.Models;
using ClassBooking.API.Services;
using ClassBooking.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClassBooking.API.Controllers
{
    [Authorize]
    [Route("api/teacher")]
    [ApiController]
    public class TeacherManagementController : ControllerBase
    {
        private readonly ITeacherService _teacherService;
        private readonly ITeacherRepository _teacherRepository;

        public TeacherManagementController(ITeacherService teacherService, ITeacherRepository teacherRepository)
        {
            _teacherService = teacherService;
            _teacherRepository = teacherRepository;
        }

        // Profile Management
        [HttpGet("profile")]
        public async Task<ActionResult<TeacherProfile>> GetMyProfile()
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            return Ok(teacher);
        }

        [HttpPut("profile")]
        public async Task<ActionResult<TeacherProfile>> UpdateProfile([FromBody] UpdateTeacherProfileRequest request)
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            var updates = new TeacherProfile
            {
                Bio = request.Bio,
                HourlyRate = request.HourlyRate ?? teacher.HourlyRate,
                ExperienceYears = request.ExperienceYears ?? teacher.ExperienceYears,
                IsAvailable = request.IsAvailable ?? teacher.IsAvailable,
                ProfilePicture = request.ProfilePicture
            };

            var updated = await _teacherService.UpdateTeacherProfileAsync(teacher.Id, updates);
            return Ok(updated);
        }

        // Subject Management
        [HttpPost("profile/subjects")]
        public async Task<ActionResult<TeacherSubject>> AddSubject([FromBody] TeacherSubject subject)
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            var added = await _teacherService.AddSubjectAsync(teacher.Id, subject);
            return Ok(added);
        }

        [HttpDelete("profile/subjects/{subjectId}")]
        public async Task<ActionResult> RemoveSubject(string subjectId)
        {
            var result = await _teacherService.RemoveSubjectAsync(subjectId);
            if (!result)
                return NotFound("Subject not found");

            return Ok();
        }

        // Availability Management
        [HttpPut("profile/availability")]
        public async Task<ActionResult> UpdateAvailability([FromBody] List<TeacherAvailability> availability)
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            await _teacherService.UpdateAvailabilityAsync(teacher.Id, availability);
            return Ok();
        }

        // Student Management
        [HttpGet("students")]
        public async Task<ActionResult> GetTeacherStudents()
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
           if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            var students = await _teacherRepository.GetTeacherStudentsAsync(teacher.Id);
            return Ok(students);
        }

        [HttpGet("students/{studentId}/progress")]
        public async Task<ActionResult> GetStudentProgress(string studentId)
        {
            // Mock for now - would integrate with actual progress tracking system
            return Ok(new
            {
                studentId,
                overallPerformance = "Good",
                subjects = new[] { new { name = "Math", score = 85 } }
            });
        }

        // Attendance
        [HttpGet("attendance")]
        public async Task<ActionResult> GetAttendanceRecords([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            var records = await _teacherRepository.GetAttendanceRecordsAsync(teacher.Id, startDate, endDate);
            return Ok(records);
        }

        [HttpPost("attendance")]
        public async Task<ActionResult> MarkAttendance([FromBody] List<AttendanceRecordRequest> records)
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            var entities = records.Select(r => new Entities.AttendanceRecordEntity
            {
                TeacherProfileId = teacher.Id,
                StudentId = r.StudentId,
                ClassId = r.ClassId,
                ClassDate = r.ClassDate,
                Status = r.Status,
                Notes = r.Notes,
                Subject = r.Subject
            }).ToList();

            await _teacherRepository.MarkBulkAttendanceAsync(entities);
            return Ok(true);
        }

        // Lesson Plans
        [HttpGet("lesson-plans")]
        public async Task<ActionResult> GetLessonPlans()
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            var plans = await _teacherRepository.GetTeacherLessonPlansAsync(teacher.Id);
            return Ok(plans);
        }

        [HttpPost("lesson-plans")]
        public async Task<ActionResult> CreateLessonPlan([FromBody] LessonPlanRequest request)
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            var entity = new Entities.LessonPlanEntity
            {
                TeacherProfileId = teacher.Id,
                Title = request.Title,
                Subject = request.Subject,
                Level = request.Level,
                ScheduledDate = request.ScheduledDate,
                Description = request.Description,
                LearningObjectives = request.LearningObjectives,
                Materials = request.Materials,
                Activities = request.Activities,
                Assessment = request.Assessment,
                Homework = request.Homework,
                DurationMinutes = request.DurationMinutes,
                Status = request.Status ?? "Draft"
            };

            var created = await _teacherRepository.CreateLessonPlanAsync(entity);
            return Ok(created);
        }

        [HttpPut("lesson-plans/{id}")]
        public async Task<ActionResult> UpdateLessonPlan(string id, [FromBody] LessonPlanRequest request)
        {
            var plan = await _teacherRepository.GetLessonPlanAsync(id);
            if (plan == null)
                return NotFound("Lesson plan not found");

            plan.Title = request.Title;
            plan.Subject = request.Subject;
            plan.Level = request.Level;
            plan.ScheduledDate = request.ScheduledDate;
            plan.Description = request.Description;
            plan.LearningObjectives = request.LearningObjectives;
            plan.Materials = request.Materials;
            plan.Activities = request.Activities;
            plan.Assessment = request.Assessment;
            plan.Homework = request.Homework;
            plan.DurationMinutes = request.DurationMinutes;
            plan.Status = request.Status ?? plan.Status;

            var updated = await _teacherRepository.UpdateLessonPlanAsync(plan);
            return Ok(updated);
        }

        [HttpDelete("lesson-plans/{id}")]
        public async Task<ActionResult> DeleteLessonPlan(string id)
        {
            var result = await _teacherRepository.DeleteLessonPlanAsync(id);
            if (!result)
                return NotFound("Lesson plan not found");

            return Ok(true);
        }

        // Analytics (Mock for now)
        [HttpGet("analytics")]
        public async Task<ActionResult> GetAnalytics([FromQuery] string period = "monthly")
        {
            var userId = User.FindFirst("userId")?.Value ?? User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
            if (teacher == null)
                return NotFound("Teacher profile not found");

            // Return actual data from teacher profile
            return Ok(new
            {
                totalStudents = teacher.TotalClasses, // Ideally count distinct students
                totalClasses = teacher.TotalClasses,
                averageRating = teacher.AverageRating,
                totalReviews = teacher.TotalReviews,
                monthlyEarnings = 0, // Would calculate from bookings
                period
            });
        }

        [HttpGet("analytics/earnings")]
        public async Task<ActionResult> GetEarningsAnalytics([FromQuery] string period = "monthly")
        {
            // Mock data - would integrate with booking/payment system
            return Ok(new
            {
                period,
                totalEarnings = 0,
                chartData = new object[] { }
            });
        }

        [HttpGet("analytics/subjects")]
        public async Task<ActionResult> GetSubjectPerformance()
        {
            // Mock data - would calculate from actual class data
            return Ok(new object[] { });
        }

        // Communication
        [HttpGet("communication/conversations")]
        public async Task<ActionResult> GetConversations()
        {
            // Mock - would integrate with messaging system
            return Ok(new object[] { });
        }

        [HttpGet("communication/announcements")]
        public async Task<ActionResult> GetAnnouncements()
        {
            // Mock - would integrate with announcement system
            return Ok(new object[] { });
        }

        [HttpPost("communication/messages")]
        public async Task<ActionResult> SendMessage([FromBody] object message)
        {
            // Mock - would integrate with messaging system
            return Ok(true);
        }

        [HttpPost("communication/announcements")]
        public async Task<ActionResult> CreateAnnouncement([FromBody] object announcement)
        {
            // Mock - would integrate with announcement system
            return Ok(announcement);
        }
    }

    // Request DTOs
    public class UpdateTeacherProfileRequest
    {
        public string? Bio { get; set; }
        public decimal? HourlyRate { get; set; }
        public int? ExperienceYears { get; set; }
        public bool? IsAvailable { get; set; }
        public string? ProfilePicture { get; set; }
    }

    public class AttendanceRecordRequest
    {
        public string StudentId { get; set; } = string.Empty;
        public string ClassId { get; set; } = string.Empty;
        public DateTime ClassDate { get; set; }
        public string Status { get; set; } = "Present";
        public string? Notes { get; set; }
        public string? Subject { get; set; }
    }

    public class LessonPlanRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public string? Description { get; set; }
        public string? LearningObjectives { get; set; }
        public string? Materials { get; set; }
        public string? Activities { get; set; }
        public string? Assessment { get; set; }
        public string? Homework { get; set; }
        public int DurationMinutes { get; set; }
        public string? Status { get; set; }
    }
}

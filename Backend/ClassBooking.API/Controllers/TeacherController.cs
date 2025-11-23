using ClassBooking.API.Models;
using ClassBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClassBooking.API.Controllers
{
    [Route("api/teachers")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teacherService;

        public TeacherController(ITeacherService teacherService)
        {
            _teacherService = teacherService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TeacherProfile>>> GetAllTeachers()
        {
            var teachers = await _teacherService.GetAllTeachersAsync();
            return Ok(teachers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeacherProfile>> GetTeacherById(string id)
        {
            var teacher = await _teacherService.GetTeacherByIdAsync(id);
            if (teacher == null) return NotFound();
            return Ok(teacher);
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<TeacherProfile>>> SearchTeachers(
            [FromQuery] string? subject,
            [FromQuery] string? level,
            [FromQuery] string? medium)
        {
            var teachers = await _teacherService.SearchTeachersAsync(subject, level, medium);
            return Ok(teachers);
        }

        [HttpGet("top-rated")]
        public async Task<ActionResult<List<TeacherProfile>>> GetTopRatedTeachers([FromQuery] int limit = 10)
        {
            var teachers = await _teacherService.GetTopRatedTeachersAsync(limit);
            return Ok(teachers);
        }

        [HttpGet("{teacherId}/reviews")]
        public async Task<ActionResult<List<ReviewDto>>> GetTeacherReviews(string teacherId)
        {
            var reviews = await _teacherService.GetTeacherReviewsAsync(teacherId);
            return Ok(reviews);
        }

        [Authorize]
        [HttpPost("{teacherId}/rate")]
        public async Task<ActionResult<ReviewDto>> RateTeacher(
            string teacherId,
            [FromBody] RateTeacherRequest request)
        {
            // In a real app, get student ID from auth context
            var studentId = User.FindFirst("userId")?.Value ?? "temp-student-id";
            var studentName = User.FindFirst("fullName")?.Value ?? "Anonymous";

            var review = await _teacherService.AddReviewAsync(
                teacherId, 
                studentId, 
                studentName, 
                request.Rating, 
                request.Review);
            
            return Ok(review);
        }
    }

    public class RateTeacherRequest
    {
        public int Rating { get; set; }
        public string? Review { get; set; }
    }
}

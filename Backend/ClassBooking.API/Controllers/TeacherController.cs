using ClassBooking.API.Models;
using ClassBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace ClassBooking.API.Controllers
{
    [Route("api/teachers")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teacherService;
        private readonly IBookingService _bookingService;

        public TeacherController(ITeacherService teacherService, IBookingService bookingService)
        {
            _teacherService = teacherService;
            _bookingService = bookingService;
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
            try
            {
                var teacher = await _teacherService.GetTeacherByIdAsync(id);
                if (teacher == null) return NotFound($"Teacher with ID {id} not found.");
                return Ok(teacher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving teacher", details = ex.Message });
            }
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

        [HttpGet("{teacherId}/availability/slots")]
        public async Task<ActionResult<List<TeacherAvailabilitySlot>>> GetTeacherAvailabilitySlots(
            string teacherId,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var slots = await _teacherService.GetAvailabilitySlotsAsync(teacherId, startDate, endDate);
            return Ok(slots);
        }

        [Authorize]
        [HttpPost("{teacherId}/rate")]
        public async Task<ActionResult<ReviewDto>> RateTeacher(
            string teacherId,
            [FromBody] RateTeacherRequest request)
        {
            var role = User.FindFirst("role")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (!string.Equals(role, "Student", StringComparison.OrdinalIgnoreCase))
            {
                return Forbid();
            }

            var studentId = User.FindFirst("userId")?.Value ?? "temp-student-id";
            var studentName = User.FindFirst("fullName")?.Value ?? "Anonymous";

            var bookings = await _bookingService.GetBookingsForStudentAsync(studentId);
            var hasBooking = bookings.Any(b => b.TeacherId == teacherId &&
                (b.Status == "Confirmed" || b.Status == "Completed"));
            if (!hasBooking)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "You can only review teachers you have booked." });
            }

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

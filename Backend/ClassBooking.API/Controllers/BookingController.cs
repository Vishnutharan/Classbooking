using ClassBooking.API.Models;
using ClassBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClassBooking.API.Controllers
{
    [Route("api/bookings")]
    [ApiController]
    [Authorize]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ITeacherService _teacherService;

        public BookingController(
            IBookingService bookingService,
            ITeacherService teacherService)
        {
            _bookingService = bookingService;
            _teacherService = teacherService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Models.ClassBooking>>> GetBookings()
        {
            var userId = User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException();
            var role = User.FindFirst("role")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (role == "Teacher")
            {
                var teacher = await _teacherService.GetTeacherByUserIdAsync(userId);
                if (teacher == null)
                {
                    return NotFound(new { message = "Teacher profile not found for current user" });
                }

                var bookings = await _bookingService.GetBookingsForTeacherAsync(teacher.Id);
                return Ok(bookings);
            }

            if (role == "Admin")
            {
                var bookings = await _bookingService.GetAllBookingsAsync();
                return Ok(bookings);
            }

            var studentBookings = await _bookingService.GetBookingsForStudentAsync(userId);
            return Ok(studentBookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Models.ClassBooking>> GetBookingById(string id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null) return NotFound();
            return Ok(booking);
        }

        [HttpPost]
        public async Task<ActionResult<BookingResponse>> CreateBooking([FromBody] BookingRequest request)
        {
            var studentId = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(studentId)) return Unauthorized();

            try
            {
                var response = await _bookingService.CreateBookingAsync(studentId, request);
                if (!response.Success)
                {
                    return BadRequest(response);
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error creating booking", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<BookingResponse>> UpdateBooking(string id, [FromBody] BookingRequest request)
        {
            var response = await _bookingService.UpdateBookingAsync(id, request);
            return Ok(response);
        }

        [HttpPost("{id}/confirm")]
        public async Task<ActionResult<BookingResponse>> ConfirmBooking(string id)
        {
            var response = await _bookingService.ConfirmBookingAsync(id);
            return Ok(response);
        }

        [HttpPost("{id}/cancel")]
        public async Task<ActionResult<BookingResponse>> CancelBooking(string id, [FromBody] CancelRequest? request)
        {
            var response = await _bookingService.CancelBookingAsync(id, request?.Reason);
            return Ok(response);
        }

        [HttpPost("{id}/complete")]
        public async Task<ActionResult<BookingResponse>> CompleteBooking(string id)
        {
            var response = await _bookingService.CompleteBookingAsync(id);
            return Ok(response);
        }

        [HttpPost("{id}/reschedule")]
        public async Task<ActionResult<BookingResponse>> RescheduleBooking(string id, [FromBody] RescheduleRequest request)
        {
            var response = await _bookingService.RescheduleBookingAsync(id, request.NewDate, request.NewStartTime, request.NewEndTime);
            return Ok(response);
        }

        [HttpGet("slots")]
        public async Task<ActionResult<List<string>>> GetAvailableSlots([FromQuery] string teacherId, [FromQuery] DateTime date)
        {
            var slots = await _bookingService.GetAvailableSlotsAsync(teacherId, date);
            return Ok(slots);
        }
    }

    public class CancelRequest
    {
        public string? Reason { get; set; }
    }

    public class RescheduleRequest
    {
        public DateTime NewDate { get; set; }
        public string NewStartTime { get; set; } = string.Empty;
        public string NewEndTime { get; set; } = string.Empty;
    }
}

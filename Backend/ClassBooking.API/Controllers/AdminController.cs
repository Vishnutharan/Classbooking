using ClassBooking.API.Models.Dto;
using ClassBooking.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _adminService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });
            
            return Ok(user);
        }

        [HttpGet("users/role/{role}")]
        public async Task<IActionResult> GetUsersByRole(string role)
        {
            var users = await _adminService.GetUsersByRoleAsync(role);
            return Ok(users);
        }

        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(string id, [FromBody] UpdateUserStatusRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _adminService.UpdateUserStatusAsync(id, request.Status);
            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User status updated successfully" });
        }

        [HttpPut("users")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = await _adminService.UpdateUserAsync(request);
                return Ok(new { message = "User updated successfully", user });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var result = await _adminService.DeleteUserAsync(id);
            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetSystemStats()
        {
            var stats = await _adminService.GetSystemStatsAsync();
            return Ok(stats);
        }

        // Placeholder endpoints for features to be implemented later
        [HttpGet("timetable")]
        public IActionResult GetTimetable()
        {
            // TODO: Implement timetable management (holidays, exam periods, etc.)
            return Ok(new List<TimetableEventDto>());
        }

        [HttpPost("timetable")]
        public IActionResult CreateTimetableEvent([FromBody] TimetableEventDto eventDto)
        {
            // TODO: Implement timetable event creation
            return Ok(new { message = "Timetable event created (placeholder)" });
        }

        [HttpGet("reports")]
        public IActionResult GetReports([FromQuery] ReportRequest? request)
        {
            // TODO: Implement report generation
            return Ok(new { message = "Report generation not yet implemented", request });
        }

        [HttpGet("fees")]
        public IActionResult GetFees()
        {
            // TODO: Implement fee management overview for admin
            return Ok(new List<object>());
        }

        [HttpGet("exams")]
        public IActionResult GetExams()
        {
            // TODO: Implement exam management for admin
            return Ok(new List<object>());
        }
    }
}

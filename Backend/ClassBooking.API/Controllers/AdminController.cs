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

        [HttpGet("stats")]
        public async Task<IActionResult> GetSystemStats()
        {
            var stats = await _adminService.GetSystemStatsAsync();
            return Ok(stats);
        }

        // Placeholder endpoints for other admin features to prevent 404s on frontend
        [HttpGet("timetable")]
        public IActionResult GetTimetable()
        {
            return Ok(new List<object>());
        }

        [HttpGet("reports")]
        public IActionResult GetReports()
        {
            return Ok(new List<object>());
        }

        [HttpGet("fees")]
        public IActionResult GetFees()
        {
            return Ok(new List<object>());
        }

        [HttpGet("exams")]
        public IActionResult GetExams()
        {
            return Ok(new List<object>());
        }
    }
}

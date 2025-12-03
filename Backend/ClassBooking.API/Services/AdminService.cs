using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;
using ClassBooking.API.Models;
using ClassBooking.API.Models.Dto;

namespace ClassBooking.API.Services
{
    public interface IAdminService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<SystemStatsDto> GetSystemStatsAsync();
        Task<List<UserDto>> GetUsersByRoleAsync(string role);
        Task<UserDto?> GetUserByIdAsync(string id);
        Task<bool> UpdateUserStatusAsync(string userId, string status);
        Task<bool> DeleteUserAsync(string userId);
        Task<User> UpdateUserAsync(UpdateUserRequest request);
    }

    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly IFeeRepository _feeRepository;

        public AdminService(
            IUserRepository userRepository,
            ITeacherRepository teacherRepository,
            IStudentRepository studentRepository,
            IBookingRepository bookingRepository,
            IFeeRepository feeRepository)
        {
            _userRepository = userRepository;
            _teacherRepository = teacherRepository;
            _studentRepository = studentRepository;
            _bookingRepository = bookingRepository;
            _feeRepository = feeRepository;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return users.Select(MapUserToDto).ToList();
        }

        public async Task<SystemStatsDto> GetSystemStatsAsync()
        {
            var totalUsers = await _userRepository.GetTotalUsersCountAsync();
            var teachers = await _teacherRepository.GetAllTeachersAsync();
            var students = await _studentRepository.GetAllStudentsAsync();
            var allBookings = await _bookingRepository.GetAllAsync();
            
            var activeBookings = allBookings.Count(b => b.Status == "Confirmed" || b.Status == "Pending");
            var completedBookings = allBookings.Count(b => b.Status == "Completed");

            // Calculate new users this month
            var firstDayOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var users = await _userRepository.GetAllUsersAsync();
            var newUsersThisMonth = users.Count(u => u.CreatedAt >= firstDayOfMonth);

            // Get total revenue (simplified - would need proper calculation)
            var totalRevenue = 0m; // Placeholder - can implement proper revenue calculation

            return new SystemStatsDto
            {
                TotalUsers = totalUsers,
                TotalTeachers = teachers.Count,
                TotalStudents = students.Count,
                TotalBookings = allBookings.Count,
                ActiveBookings = activeBookings,
                CompletedBookings = completedBookings,
                TotalRevenue = totalRevenue,
                NewUsersThisMonth = newUsersThisMonth
            };
        }

        public async Task<List<UserDto>> GetUsersByRoleAsync(string role)
        {
            var users = await _userRepository.GetUsersByRoleAsync(role);
            return users.Select(MapUserToDto).ToList();
        }

        public async Task<UserDto?> GetUserByIdAsync(string id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user != null ? MapUserToDto(user) : null;
        }

        public async Task<bool> UpdateUserStatusAsync(string userId, string status)
        {
            return await _userRepository.UpdateUserStatusAsync(userId, status);
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            return await _userRepository.DeleteUserAsync(userId);
        }

        public async Task<User> UpdateUserAsync(UpdateUserRequest request)
        {
            var user = await _userRepository.GetByIdAsync(request.Id);
            if (user == null)
                throw new Exception("User not found");

            if (!string.IsNullOrEmpty(request.Email))
                user.Email = request.Email;
            if (!string.IsNullOrEmpty(request.FullName))
                user.FullName = request.FullName;
            if (request.ProfilePicture != null)
                user.ProfilePicture = request.ProfilePicture;
            if (request.Bio != null)
                user.Bio = request.Bio;
            if (request.PhoneNumber != null)
                user.PhoneNumber = request.PhoneNumber;

            return await _userRepository.UpdateUserAsync(user);
        }

        private UserDto MapUserToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ProfilePicture = user.ProfilePicture,
                Bio = user.Bio,
                PhoneNumber = user.PhoneNumber,
                Status = user.Status,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin
            };
        }
    }
}

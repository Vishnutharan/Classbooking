using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IAdminService
    {
        Task<List<object>> GetAllUsersAsync(); // Simplified for now
        Task<object> GetSystemStatsAsync();
    }

    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly IStudentRepository _studentRepository;

        public AdminService(
            IUserRepository userRepository,
            ITeacherRepository teacherRepository,
            IStudentRepository studentRepository)
        {
            _userRepository = userRepository;
            _teacherRepository = teacherRepository;
            _studentRepository = studentRepository;
        }

        public async Task<List<object>> GetAllUsersAsync()
        {
            // In a real app, we would map UserEntity to a DTO
            // For now, returning empty list as placeholder until UserEntity is fully exposed
            return new List<object>(); 
        }

        public async Task<object> GetSystemStatsAsync()
        {
            var teachers = await _teacherRepository.GetAllTeachersAsync();
            // var students = await _studentRepository.GetAllStudentsAsync(); // Need to implement GetAllStudents
            
            return new
            {
                TotalTeachers = teachers.Count,
                TotalStudents = 0, // Placeholder
                TotalBookings = 0  // Placeholder
            };
        }
    }
}

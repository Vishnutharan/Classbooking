using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IAttendanceService
    {
        Task<List<AttendanceRecordEntity>> GetRecordsAsync(string teacherId, DateTime? startDate, DateTime? endDate);
        Task<bool> MarkAttendanceAsync(List<AttendanceRecordEntity> records);
        Task<AttendanceStats> GetStatisticsAsync(string teacherId);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly IAttendanceRepository _attendanceRepository;

        public AttendanceService(IAttendanceRepository attendanceRepository)
        {
            _attendanceRepository = attendanceRepository;
        }

        public async Task<List<AttendanceRecordEntity>> GetRecordsAsync(string teacherId, DateTime? startDate, DateTime? endDate)
        {
            return await _attendanceRepository.GetRecordsAsync(teacherId, startDate, endDate);
        }

        public async Task<bool> MarkAttendanceAsync(List<AttendanceRecordEntity> records)
        {
            return await _attendanceRepository.MarkAttendanceAsync(records);
        }

        public async Task<AttendanceStats> GetStatisticsAsync(string teacherId)
        {
            return await _attendanceRepository.GetStatisticsAsync(teacherId);
        }
    }
}

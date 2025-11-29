using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IAttendanceRepository
    {
        Task<List<AttendanceRecordEntity>> GetRecordsAsync(string teacherId, DateTime? startDate, DateTime? endDate);
        Task<bool> MarkAttendanceAsync(List<AttendanceRecordEntity> records);
        Task<AttendanceStats> GetStatisticsAsync(string teacherId);
    }

    public class AttendanceRepository : IAttendanceRepository
    {
        private readonly ClassBookingDbContext _context;

        public AttendanceRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<AttendanceRecordEntity>> GetRecordsAsync(string teacherId, DateTime? startDate, DateTime? endDate)
        {
            var query = _context.AttendanceRecords
                .Where(a => a.TeacherProfileId == teacherId);

            if (startDate.HasValue)
                query = query.Where(a => a.ClassDate >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(a => a.ClassDate <= endDate.Value);

            return await query
                .OrderByDescending(a => a.ClassDate)
                .ToListAsync();
        }

        public async Task<bool> MarkAttendanceAsync(List<AttendanceRecordEntity> records)
        {
            try
            {
                await _context.AttendanceRecords.AddRangeAsync(records);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<AttendanceStats> GetStatisticsAsync(string teacherId)
        {
            var records = await _context.AttendanceRecords
                .Where(a => a.TeacherProfileId == teacherId)
                .ToListAsync();

            var totalSessions = records.Count;
            var presentCount = records.Count(r => r.Status == "Present");
            var absentCount = records.Count(r => r.Status == "Absent");
            var lateCount = records.Count(r => r.Status == "Late");
            var excusedCount = records.Count(r => r.Status == "Excused");

            return new AttendanceStats
            {
                TotalSessions = totalSessions,
                AverageAttendance = totalSessions > 0 ? (presentCount * 100.0 / totalSessions) : 0,
                PresentCount = presentCount,
                AbsentCount = absentCount,
                LateCount = lateCount,
                ExcusedCount = excusedCount
            };
        }
    }

    public class AttendanceStats
    {
        public int TotalSessions { get; set; }
        public double AverageAttendance { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public int ExcusedCount { get; set; }
    }
}

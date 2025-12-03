using ClassBooking.API.Data;
using ClassBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IAnalyticsRepository
    {
        Task<TeacherAnalyticsDto> GetTeacherAnalyticsAsync(string teacherId, string period);
        Task<EarningsAnalyticsDto> GetEarningsAnalyticsAsync(string teacherId, string period);
        Task<List<SubjectPerformanceDto>> GetSubjectPerformanceAsync(string teacherId);
    }

    public class AnalyticsRepository : IAnalyticsRepository
    {
        private readonly ClassBookingDbContext _context;

        public AnalyticsRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<TeacherAnalyticsDto> GetTeacherAnalyticsAsync(string teacherId, string period)
        {
            var dateFilter = GetDateFilter(period);

            // Get total students
            var totalStudents = await _context.TeacherStudents
                .Where(ts => ts.TeacherProfileId == teacherId && ts.IsActive)
                .CountAsync();

            // Get completed classes
            var completedClasses = await _context.Bookings
                .Where(b => b.TeacherId == teacherId && 
                           b.Status == "Completed" && 
                           b.Date >= dateFilter)
                .CountAsync();

            // Get average rating
            var ratings = await _context.Reviews
                .Where(r => r.TeacherProfileId == teacherId)
                .Select(r => r.Rating)
                .ToListAsync();
            
            var averageRating = ratings.Any() ? ratings.Average() : 0;

            // Get average attendance
            var attendanceRecords = await _context.AttendanceRecords
                .Where(a => a.TeacherProfileId == teacherId && a.ClassDate >= dateFilter)
                .ToListAsync();
            
            var totalRecords = attendanceRecords.Count;
            var presentCount = attendanceRecords.Count(a => a.Status == "Present");
            var averageAttendance = totalRecords > 0 ? (presentCount * 100.0 / totalRecords) : 0;

            return new TeacherAnalyticsDto
            {
                TotalStudents = totalStudents,
                CompletedClasses = completedClasses,
                AverageRating = averageRating,
                AverageAttendance = (int)Math.Round(averageAttendance)
            };
        }

        public async Task<EarningsAnalyticsDto> GetEarningsAnalyticsAsync(string teacherId, string period)
        {
            var dateFilter = GetDateFilter(period);

            // Get all completed bookings
            var bookings = await _context.Bookings
                .Where(b => b.TeacherId == teacherId && 
                           b.Status == "Completed" && 
                           b.Date >= dateFilter)
                .ToListAsync();

            // Calculate total hours
            var totalHours = bookings.Sum(b =>
            {
                var start = TimeSpan.Parse(b.StartTime);
                var end = TimeSpan.Parse(b.EndTime);
                return (end - start).TotalHours;
            });

            // Get teacher's hourly rate for calculations
            var teacherProfile = await _context.TeacherProfiles
                .FirstOrDefaultAsync(t => t.Id == teacherId);
            
            var hourlyRate = teacherProfile?.HourlyRate ?? 0;
            var totalEarnings = totalHours * (double)hourlyRate;
            var averageHourlyRate = hourlyRate;

            // Projected earnings (estimate based on confirmed future bookings)
            var upcomingBookings = await _context.Bookings
                .Where(b => b.TeacherId == teacherId && 
                           b.Status == "Confirmed" && 
                           b.Date >= DateTime.UtcNow)
                .ToListAsync();
                
            var upcomingHours = upcomingBookings.Sum(b =>
            {
                var start = TimeSpan.Parse(b.StartTime);
                var end = TimeSpan.Parse(b.EndTime);
                return (end - start).TotalHours;
            });
            
            var projectedEarnings = upcomingHours * (double)hourlyRate;

            // Earnings by subject
            var earningsBySubject = bookings
                .GroupBy(b => b.Subject)
                .Select(g => new SubjectEarningsDto
                {
                    Subject = g.Key,
                    Earnings = g.Sum(b => {
                        var start = TimeSpan.Parse(b.StartTime);
                        var end = TimeSpan.Parse(b.EndTime);
                        return (end - start).TotalHours * (double)hourlyRate;
                    }),
                    Percentage = 0 // Will calculate later
                })
                .ToList();

            // Calculate percentages
            foreach (var item in earningsBySubject)
            {
                item.Percentage = totalEarnings > 0 ? (int)Math.Round((item.Earnings / totalEarnings) * 100) : 0;
            }

            return new EarningsAnalyticsDto
            {
                TotalEarnings = totalEarnings,
                ProjectedEarnings = totalEarnings + projectedEarnings,
                AverageHourlyRate = (double)averageHourlyRate,
                TotalHoursTeaching = (int)Math.Round(totalHours),
                EarningsBySubject = earningsBySubject
            };
        }

        public async Task<List<SubjectPerformanceDto>> GetSubjectPerformanceAsync(string teacherId)
        {
            // Get all students taught by this teacher
            var students = await _context.TeacherStudents
                .Where(ts => ts.TeacherProfileId == teacherId && ts.IsActive)
                .ToListAsync();

            // Get subjects from teacher's subject list
            var teacherSubjects = await _context.Set<Entities.TeacherSubjectEntity>()
                .Where(ts => ts.TeacherProfileId == teacherId)
                .ToListAsync();

            var performanceList = new List<SubjectPerformanceDto>();

            // Group students by subject from TeacherStudents
            var subjectGroups = students
                .Where(s => !string.IsNullOrEmpty(s.Subject))
                .GroupBy(s => s.Subject!);

            foreach (var subjectGroup in subjectGroups)
            {
                var subject = subjectGroup.Key;
                var subjectStudents = subjectGroup.ToList();

                // Get exam results for these students in this subject
                var examResults = await _context.ExamResults
                    .Where(er => subjectStudents.Select(s => s.StudentId).Contains(er.StudentId) && 
                                er.Subject == subject)
                    .ToListAsync();

                var averageScore = examResults.Any() ? examResults.Average(er => er.Score) : 0;
                var passRate = examResults.Any() ? 
                    (examResults.Count(er => er.Score >= 40) * 100.0 / examResults.Count) : 0;

                // Get satisfaction from reviews
                var reviews = await _context.Reviews
                    .Where(r => r.TeacherProfileId == teacherId)
                    .ToListAsync();
                
                var satisfaction = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

                performanceList.Add(new SubjectPerformanceDto
                {
                    Subject = subject,
                    TotalStudents = subjectStudents.Count,
                    AverageScore = averageScore,
                    PassRate = passRate,
                    StudentSatisfaction = satisfaction
                });
            }

            return performanceList;
        }

        private DateTime GetDateFilter(string period)
        {
            return period.ToLower() switch
            {
                "daily" => DateTime.UtcNow.Date,
                "weekly" => DateTime.UtcNow.AddDays(-7),
                "monthly" => DateTime.UtcNow.AddMonths(-1),
                "yearly" => DateTime.UtcNow.AddYears(-1),
                _ => DateTime.UtcNow.AddMonths(-1)
            };
        }
    }
}

using ClassBooking.API.Models;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IAnalyticsService
    {
        Task<TeacherAnalyticsDto> GetTeacherAnalyticsAsync(string teacherId, string period);
        Task<EarningsAnalyticsDto> GetEarningsAnalyticsAsync(string teacherId, string period);
        Task<List<SubjectPerformanceDto>> GetSubjectPerformanceAsync(string teacherId);
    }

    public class AnalyticsService : IAnalyticsService
    {
        private readonly IAnalyticsRepository _analyticsRepository;

        public AnalyticsService(IAnalyticsRepository analyticsRepository)
        {
            _analyticsRepository = analyticsRepository;
        }

        public async Task<TeacherAnalyticsDto> GetTeacherAnalyticsAsync(string teacherId, string period)
        {
            return await _analyticsRepository.GetTeacherAnalyticsAsync(teacherId, period);
        }

        public async Task<EarningsAnalyticsDto> GetEarningsAnalyticsAsync(string teacherId, string period)
        {
            return await _analyticsRepository.GetEarningsAnalyticsAsync(teacherId, period);
        }

        public async Task<List<SubjectPerformanceDto>> GetSubjectPerformanceAsync(string teacherId)
        {
            return await _analyticsRepository.GetSubjectPerformanceAsync(teacherId);
        }
    }
}

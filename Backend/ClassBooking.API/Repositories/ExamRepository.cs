using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IExamRepository
    {
        Task<List<ExamResultEntity>> GetResultsByStudentAsync(string studentId);
        Task<List<ExamResultEntity>> GetResultsByExamAsync(string examType, string? term, int? year);
        Task<ExamResultEntity> AddResultAsync(ExamResultEntity result);
        Task<ExamResultEntity?> GetResultByIdAsync(string id);
        Task<ExamResultEntity> UpdateResultAsync(ExamResultEntity result);
        Task<List<ExamPreparationEntity>> GetExamPreparationsAsync(string? examType);
        Task<ExamPreparationEntity?> GetExamPreparationByIdAsync(string id);
        Task<List<ResourceEntity>> GetResourcesAsync(string? subject, string? level, string? examType, int? year);
    }

    public class ExamRepository : IExamRepository
    {
        private readonly ClassBookingDbContext _context;

        public ExamRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<ExamResultEntity>> GetResultsByStudentAsync(string studentId)
        {
            return await _context.ExamResults
                .Where(r => r.StudentId == studentId)
                .OrderByDescending(r => r.ExamDate)
                .ToListAsync();
        }

        public async Task<List<ExamResultEntity>> GetResultsByExamAsync(string examType, string? term, int? year)
        {
            var query = _context.ExamResults.Where(r => r.ExamType == examType);

            if (!string.IsNullOrEmpty(term))
                query = query.Where(r => r.Term == term);

            if (year.HasValue)
                query = query.Where(r => r.Year == year);

            return await query.OrderByDescending(r => r.ExamDate).ToListAsync();
        }

        public async Task<ExamResultEntity> AddResultAsync(ExamResultEntity result)
        {
            _context.ExamResults.Add(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<ExamResultEntity?> GetResultByIdAsync(string id)
        {
            return await _context.ExamResults.FindAsync(id);
        }

        public async Task<ExamResultEntity> UpdateResultAsync(ExamResultEntity result)
        {
            _context.ExamResults.Update(result);
            await _context.SaveChangesAsync();
            return result;
        }

        public async Task<List<ExamPreparationEntity>> GetExamPreparationsAsync(string? examType)
        {
            var query = _context.ExamPreparations.AsQueryable();

            if (!string.IsNullOrEmpty(examType))
                query = query.Where(e => e.ExamType == examType);

            return await query.ToListAsync();
        }

        public async Task<ExamPreparationEntity?> GetExamPreparationByIdAsync(string id)
        {
            return await _context.ExamPreparations.FindAsync(id);
        }

        public async Task<List<ResourceEntity>> GetResourcesAsync(string? subject, string? level, string? examType, int? year)
        {
            var query = _context.Resources.AsQueryable();

            if (!string.IsNullOrEmpty(subject))
                query = query.Where(r => r.Subject == subject);

            if (!string.IsNullOrEmpty(level))
                query = query.Where(r => r.Level == level);

            if (!string.IsNullOrEmpty(examType))
                query = query.Where(r => r.ExamType == examType);

            if (year.HasValue)
                query = query.Where(r => r.Year == year);

            return await query.OrderByDescending(r => r.UploadedAt).ToListAsync();
        }
    }
}

using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IExamService
    {
        Task<List<ExamResultEntity>> GetStudentResultsAsync(string studentId);
        Task<List<ExamPreparationEntity>> GetExamPreparationsAsync(string? examType);
        Task<ExamResultEntity> AddResultAsync(ExamResultEntity result);
    }

    public class ExamService : IExamService
    {
        private readonly IExamRepository _examRepository;

        public ExamService(IExamRepository examRepository)
        {
            _examRepository = examRepository;
        }

        public async Task<List<ExamResultEntity>> GetStudentResultsAsync(string studentId)
        {
            return await _examRepository.GetResultsByStudentAsync(studentId);
        }

        public async Task<List<ExamPreparationEntity>> GetExamPreparationsAsync(string? examType)
        {
            return await _examRepository.GetExamPreparationsAsync(examType);
        }

        public async Task<ExamResultEntity> AddResultAsync(ExamResultEntity result)
        {
            return await _examRepository.AddResultAsync(result);
        }
    }
}

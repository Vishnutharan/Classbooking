using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface ILessonPlanService
    {
        Task<List<LessonPlanEntity>> GetByTeacherAsync(string teacherId);
        Task<LessonPlanEntity?> GetByIdAsync(string id);
        Task<LessonPlanEntity> CreateAsync(string teacherId, LessonPlanEntity plan);
        Task<LessonPlanEntity?> UpdateAsync(string id, LessonPlanEntity plan);
        Task<bool> DeleteAsync(string id);
    }

    public class LessonPlanService : ILessonPlanService
    {
        private readonly ILessonPlanRepository _lessonPlanRepository;

        public LessonPlanService(ILessonPlanRepository lessonPlanRepository)
        {
            _lessonPlanRepository = lessonPlanRepository;
        }

        public async Task<List<LessonPlanEntity>> GetByTeacherAsync(string teacherId)
        {
            return await _lessonPlanRepository.GetByTeacherAsync(teacherId);
        }

        public async Task<LessonPlanEntity?> GetByIdAsync(string id)
        {
            return await _lessonPlanRepository.GetByIdAsync(id);
        }

        public async Task<LessonPlanEntity> CreateAsync(string teacherId, LessonPlanEntity plan)
        {
            plan.TeacherProfileId = teacherId;
            return await _lessonPlanRepository.CreateAsync(plan);
        }

        public async Task<LessonPlanEntity?> UpdateAsync(string id, LessonPlanEntity plan)
        {
            return await _lessonPlanRepository.UpdateAsync(id, plan);
        }

        public async Task<bool> DeleteAsync(string id)
        {
            return await _lessonPlanRepository.DeleteAsync(id);
        }
    }
}

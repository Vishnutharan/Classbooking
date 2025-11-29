using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface ILessonPlanRepository
    {
        Task<List<LessonPlanEntity>> GetByTeacherAsync(string teacherId);
        Task<LessonPlanEntity?> GetByIdAsync(string id);
        Task<LessonPlanEntity> CreateAsync(LessonPlanEntity plan);
        Task<LessonPlanEntity?> UpdateAsync(string id, LessonPlanEntity plan);
        Task<bool> DeleteAsync(string id);
    }

    public class LessonPlanRepository : ILessonPlanRepository
    {
        private readonly ClassBookingDbContext _context;

        public LessonPlanRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<LessonPlanEntity>> GetByTeacherAsync(string teacherId)
        {
            return await _context.LessonPlans
                .Where(lp => lp.TeacherProfileId == teacherId)
                .OrderByDescending(lp => lp.ScheduledDate)
                .ToListAsync();
        }

        public async Task<LessonPlanEntity?> GetByIdAsync(string id)
        {
            return await _context.LessonPlans.FindAsync(id);
        }

        public async Task<LessonPlanEntity> CreateAsync(LessonPlanEntity plan)
        {
            plan.Id = Guid.NewGuid().ToString();
            plan.CreatedAt = DateTime.UtcNow;
            plan.UpdatedAt = DateTime.UtcNow;

            await _context.LessonPlans.AddAsync(plan);
            await _context.SaveChangesAsync();
            return plan;
        }

        public async Task<LessonPlanEntity?> UpdateAsync(string id, LessonPlanEntity plan)
        {
            var existing = await _context.LessonPlans.FindAsync(id);
            if (existing == null) return null;

            existing.Title = plan.Title;
            existing.Subject = plan.Subject;
            existing.Level = plan.Level;
            existing.ScheduledDate = plan.ScheduledDate;
            existing.Description = plan.Description;
            existing.LearningObjectives = plan.LearningObjectives;
            existing.Materials = plan.Materials;
            existing.Activities = plan.Activities;
            existing.Assessment = plan.Assessment;
            existing.Homework = plan.Homework;
            existing.DurationMinutes = plan.DurationMinutes;
            existing.Status = plan.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var plan = await _context.LessonPlans.FindAsync(id);
            if (plan == null) return false;

            _context.LessonPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

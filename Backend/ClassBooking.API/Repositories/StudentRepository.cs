using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IStudentRepository
    {
        Task<StudentProfileEntity?> GetByIdAsync(string id);
        Task<StudentProfileEntity?> GetByUserIdAsync(string userId);
        Task<StudentProfileEntity> CreateAsync(StudentProfileEntity profile);
        Task<StudentProfileEntity> UpdateAsync(StudentProfileEntity profile);
        Task<List<StudyGoalEntity>> GetStudyGoalsAsync(string studentId);
        Task<StudyGoalEntity> CreateStudyGoalAsync(StudyGoalEntity goal);
        Task<StudyGoalEntity?> GetStudyGoalByIdAsync(string id);
        Task<StudyGoalEntity> UpdateStudyGoalAsync(StudyGoalEntity goal);
        Task<bool> DeleteStudyGoalAsync(string id);
    }

    public class StudentRepository : IStudentRepository
    {
        private readonly ClassBookingDbContext _context;

        public StudentRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<StudentProfileEntity?> GetByIdAsync(string id)
        {
            return await _context.StudentProfiles.FindAsync(id);
        }

        public async Task<StudentProfileEntity?> GetByUserIdAsync(string userId)
        {
            return await _context.StudentProfiles
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }

        public async Task<StudentProfileEntity> CreateAsync(StudentProfileEntity profile)
        {
            _context.StudentProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<StudentProfileEntity> UpdateAsync(StudentProfileEntity profile)
        {
            profile.UpdatedAt = DateTime.UtcNow;
            _context.StudentProfiles.Update(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<List<StudyGoalEntity>> GetStudyGoalsAsync(string studentId)
        {
            return await _context.StudyGoals
                .Where(g => g.StudentId == studentId)
                .OrderBy(g => g.TargetDate)
                .ToListAsync();
        }

        public async Task<StudyGoalEntity> CreateStudyGoalAsync(StudyGoalEntity goal)
        {
            _context.StudyGoals.Add(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<StudyGoalEntity?> GetStudyGoalByIdAsync(string id)
        {
            return await _context.StudyGoals.FindAsync(id);
        }

        public async Task<StudyGoalEntity> UpdateStudyGoalAsync(StudyGoalEntity goal)
        {
            goal.UpdatedAt = DateTime.UtcNow;
            _context.StudyGoals.Update(goal);
            await _context.SaveChangesAsync();
            return goal;
        }

        public async Task<bool> DeleteStudyGoalAsync(string id)
        {
            var goal = await GetStudyGoalByIdAsync(id);
            if (goal == null) return false;

            _context.StudyGoals.Remove(goal);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

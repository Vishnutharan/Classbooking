using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface ITeacherRepository
    {
        // Teacher Profile Operations
        Task<TeacherProfileEntity?> GetTeacherByIdAsync(string id);
        Task<TeacherProfileEntity?> GetByIdAsync(string id); // Alias for GetTeacherByIdAsync
        Task<TeacherProfileEntity?> GetTeacherByUserIdAsync(string userId);
        Task<List<TeacherProfileEntity>> GetAllTeachersAsync();
        Task<List<TeacherProfileEntity>> SearchTeachersAsync(string? subject, string? level, string? medium);
        Task<List<TeacherProfileEntity>> GetTopRatedTeachersAsync(int limit = 10);
        Task<TeacherProfileEntity> CreateTeacherAsync(TeacherProfileEntity teacher);
        Task<TeacherProfileEntity> UpdateTeacherAsync(TeacherProfileEntity teacher);
        Task<bool> DeleteTeacherAsync(string id);
        
        // Teacher Subject Operations
        Task<TeacherSubjectEntity> AddSubjectAsync(TeacherSubjectEntity subject);
        Task<bool> RemoveSubjectAsync(string subjectId);
        Task<List<TeacherSubjectEntity>> GetTeacherSubjectsAsync(string teacherProfileId);
        
        // Teacher Availability Operations
        Task<List<TeacherAvailabilityEntity>> GetTeacherAvailabilityAsync(string teacherProfileId);
        Task UpdateTeacherAvailabilityAsync(string teacherProfileId, List<TeacherAvailabilityEntity> availabilities);
        
        // Teacher Qualification Operations
        Task<TeacherQualificationEntity> AddQualificationAsync(TeacherQualificationEntity qualification);
        Task<bool> RemoveQualificationAsync(string qualificationId);
        
        // Review Operations
        Task<ReviewEntity> AddReviewAsync(ReviewEntity review);
        Task<List<ReviewEntity>> GetTeacherReviewsAsync(string teacherProfileId);
        Task<double> CalculateAverageRatingAsync(string teacherProfileId);
        Task<List<ReviewEntity>> GetAllReviewsAsync();
        Task<ReviewEntity?> GetReviewByIdAsync(string reviewId);
        Task<ReviewEntity> UpdateReviewAsync(ReviewEntity review);
        Task<bool> DeleteReviewAsync(string reviewId);
        Task RefreshTeacherRatingAsync(string teacherProfileId);
        
        // Attendance Operations
        Task<AttendanceRecordEntity> CreateAttendanceAsync(AttendanceRecordEntity attendance);
        Task<List<AttendanceRecordEntity>> GetAttendanceRecordsAsync(string teacherProfileId, DateTime? startDate, DateTime? endDate);
        Task<List<AttendanceRecordEntity>> MarkBulkAttendanceAsync(List<AttendanceRecordEntity> records);
        
        // Lesson Plan Operations
        Task<LessonPlanEntity?> GetLessonPlanAsync(string id);
        Task<List<LessonPlanEntity>> GetTeacherLessonPlansAsync(string teacherProfileId);
        Task<LessonPlanEntity> CreateLessonPlanAsync(LessonPlanEntity lessonPlan);
        Task<LessonPlanEntity> UpdateLessonPlanAsync(LessonPlanEntity lessonPlan);
        Task<bool> DeleteLessonPlanAsync(string id);
        
        // Teacher-Student Relationship Operations
        // Task<List<TeacherStudentEntity>> GetTeacherStudentsAsync(string teacherProfileId);
        Task<TeacherStudentEntity> AddTeacherStudentAsync(TeacherStudentEntity relationship);
        Task<bool> RemoveTeacherStudentAsync(string teacherProfileId, string studentId);
        Task<List<TeacherStudentEntity>> GetTeacherStudentsAsync(string teacherProfileId);

        // Date-specific availability slots
        Task<List<TeacherAvailabilitySlotEntity>> GetAvailabilitySlotsAsync(string teacherProfileId, DateTime? startDate = null, DateTime? endDate = null);
        Task<TeacherAvailabilitySlotEntity?> GetAvailabilitySlotAsync(string teacherProfileId, DateTime date, string startTime, string endTime);
        Task<TeacherAvailabilitySlotEntity> AddAvailabilitySlotAsync(TeacherAvailabilitySlotEntity slot);
        Task<bool> UpdateAvailabilitySlotStatusAsync(string slotId, string status, string? bookingId = null);
        Task<TeacherAvailabilitySlotEntity?> GetAvailabilitySlotByBookingAsync(string bookingId);
        Task<bool> ReleaseSlotByBookingAsync(string bookingId);
        Task<bool> DeleteAvailabilitySlotAsync(string slotId, string teacherProfileId);
    }


    public class TeacherRepository : ITeacherRepository
    {
        private readonly ClassBookingDbContext _context;

        public TeacherRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        // Teacher Profile Operations
        public async Task<TeacherProfileEntity?> GetTeacherByIdAsync(string id)
        {
            return await _context.TeacherProfiles
                .Include(t => t.Qualifications)
                .Include(t => t.Subjects)
                .Include(t => t.Availability)
                .Include(t => t.Reviews)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<TeacherProfileEntity?> GetByIdAsync(string id)
        {
            return await GetTeacherByIdAsync(id);
        }

        public async Task<TeacherProfileEntity?> GetTeacherByUserIdAsync(string userId)
        {
            return await _context.TeacherProfiles
                .Include(t => t.Qualifications)
                .Include(t => t.Subjects)
                .Include(t => t.Availability)
                .Include(t => t.Reviews)
                .FirstOrDefaultAsync(t => t.UserId == userId);
        }

        public async Task<List<TeacherProfileEntity>> GetAllTeachersAsync()
        {
            return await _context.TeacherProfiles
                .Include(t => t.Subjects)
                .Include(t => t.Availability)
                .OrderByDescending(t => t.AverageRating)
                .ToListAsync();
        }

        public async Task<List<TeacherProfileEntity>> SearchTeachersAsync(string? subject, string? level, string? medium)
        {
            var query = _context.TeacherProfiles
                .Include(t => t.Subjects)
                .Include(t => t.Availability)
                .AsQueryable();

            if (!string.IsNullOrEmpty(subject))
            {
                query = query.Where(t => t.Subjects.Any(s => s.Name.Contains(subject)));
            }

            if (!string.IsNullOrEmpty(level))
            {
                query = query.Where(t => t.Subjects.Any(s => s.Level == level));
            }

            if (!string.IsNullOrEmpty(medium))
            {
                query = query.Where(t => t.Subjects.Any(s => s.Medium == medium));
            }

            return await query.OrderByDescending(t => t.AverageRating).ToListAsync();
        }

        public async Task<List<TeacherProfileEntity>> GetTopRatedTeachersAsync(int limit = 10)
        {
            return await _context.TeacherProfiles
                .Include(t => t.Subjects)
                .Include(t => t.Availability)
                .Where(t => t.IsAvailable && t.VerificationStatus == "Verified")
                .OrderByDescending(t => t.AverageRating)
                .ThenByDescending(t => t.TotalReviews)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<TeacherProfileEntity> CreateTeacherAsync(TeacherProfileEntity teacher)
        {
            _context.TeacherProfiles.Add(teacher);
            await _context.SaveChangesAsync();
            return teacher;
        }

        public async Task<TeacherProfileEntity> UpdateTeacherAsync(TeacherProfileEntity teacher)
        {
            teacher.UpdatedAt = DateTime.UtcNow;
            _context.TeacherProfiles.Update(teacher);
            await _context.SaveChangesAsync();
            return teacher;
        }

        public async Task<bool> DeleteTeacherAsync(string id)
        {
            var teacher = await _context.TeacherProfiles.FindAsync(id);
            if (teacher == null) return false;

            _context.TeacherProfiles.Remove(teacher);
            await _context.SaveChangesAsync();
            return true;
        }

        // Teacher Subject Operations
        public async Task<TeacherSubjectEntity> AddSubjectAsync(TeacherSubjectEntity subject)
        {
            _context.TeacherSubjects.Add(subject);
            await _context.SaveChangesAsync();
            return subject;
        }

        public async Task<bool> RemoveSubjectAsync(string subjectId)
        {
            var subject = await _context.TeacherSubjects.FindAsync(subjectId);
            if (subject == null) return false;

            _context.TeacherSubjects.Remove(subject);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TeacherSubjectEntity>> GetTeacherSubjectsAsync(string teacherProfileId)
        {
            return await _context.TeacherSubjects
                .Where(s => s.TeacherProfileId == teacherProfileId)
                .ToListAsync();
        }

        // Teacher Availability Operations
        public async Task<List<TeacherAvailabilityEntity>> GetTeacherAvailabilityAsync(string teacherProfileId)
        {
            return await _context.TeacherAvailabilities
                .Where(a => a.TeacherProfileId == teacherProfileId)
                .ToListAsync();
        }

        public async Task UpdateTeacherAvailabilityAsync(string teacherProfileId, List<TeacherAvailabilityEntity> availabilities)
        {
            // Remove existing availabilities
            var existing = await _context.TeacherAvailabilities
                .Where(a => a.TeacherProfileId == teacherProfileId)
                .ToListAsync();
            
            _context.TeacherAvailabilities.RemoveRange(existing);
            
            // Add new availabilities
            foreach (var availability in availabilities)
            {
                availability.TeacherProfileId = teacherProfileId;
            }
            
            _context.TeacherAvailabilities.AddRange(availabilities);
            await _context.SaveChangesAsync();
        }

        // Teacher Qualification Operations
        public async Task<TeacherQualificationEntity> AddQualificationAsync(TeacherQualificationEntity qualification)
        {
            _context.TeacherQualifications.Add(qualification);
            await _context.SaveChangesAsync();
            return qualification;
        }

        public async Task<bool> RemoveQualificationAsync(string qualificationId)
        {
            var qualification = await _context.TeacherQualifications.FindAsync(qualificationId);
            if (qualification == null) return false;

            _context.TeacherQualifications.Remove(qualification);
            await _context.SaveChangesAsync();
            return true;
        }

        // Review Operations
        public async Task<ReviewEntity> AddReviewAsync(ReviewEntity review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            await RefreshTeacherRatingAsync(review.TeacherProfileId);
            return review;
        }

        public async Task<List<ReviewEntity>> GetTeacherReviewsAsync(string teacherProfileId)
        {
            return await _context.Reviews
                .Where(r => r.TeacherProfileId == teacherProfileId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<double> CalculateAverageRatingAsync(string teacherProfileId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.TeacherProfileId == teacherProfileId)
                .ToListAsync();

            if (!reviews.Any()) return 0;

            return reviews.Average(r => r.Rating);
        }

        public async Task<List<ReviewEntity>> GetAllReviewsAsync()
        {
            return await _context.Reviews
                .Include(r => r.TeacherProfile)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<ReviewEntity?> GetReviewByIdAsync(string reviewId)
        {
            return await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        }

        public async Task<ReviewEntity> UpdateReviewAsync(ReviewEntity review)
        {
            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();
            await RefreshTeacherRatingAsync(review.TeacherProfileId);
            return review;
        }

        public async Task<bool> DeleteReviewAsync(string reviewId)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
            if (review == null) return false;

            var teacherId = review.TeacherProfileId;
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            await RefreshTeacherRatingAsync(teacherId);
            return true;
        }

        public async Task RefreshTeacherRatingAsync(string teacherProfileId)
        {
            var teacherProfile = await _context.TeacherProfiles.FindAsync(teacherProfileId);
            if (teacherProfile == null) return;

            var reviews = await _context.Reviews
                .Where(r => r.TeacherProfileId == teacherProfileId)
                .ToListAsync();

            teacherProfile.AverageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;
            teacherProfile.TotalReviews = reviews.Count;
            await _context.SaveChangesAsync();
        }

        // Attendance Operations
        public async Task<AttendanceRecordEntity> CreateAttendanceAsync(AttendanceRecordEntity attendance)
        {
            _context.AttendanceRecords.Add(attendance);
            await _context.SaveChangesAsync();
            return attendance;
        }

        public async Task<List<AttendanceRecordEntity>> GetAttendanceRecordsAsync(string teacherProfileId, DateTime? startDate, DateTime? endDate)
        {
            var query = _context.AttendanceRecords
                .Where(a => a.TeacherProfileId == teacherProfileId)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(a => a.ClassDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(a => a.ClassDate <= endDate.Value);
            }

            return await query.OrderByDescending(a => a.ClassDate).ToListAsync();
        }

        public async Task<List<AttendanceRecordEntity>> MarkBulkAttendanceAsync(List<AttendanceRecordEntity> records)
        {
            _context.AttendanceRecords.AddRange(records);
            await _context.SaveChangesAsync();
            return records;
        }

        // Lesson Plan Operations
        public async Task<LessonPlanEntity?> GetLessonPlanAsync(string id)
        {
            return await _context.LessonPlans.FindAsync(id);
        }

        public async Task<List<LessonPlanEntity>> GetTeacherLessonPlansAsync(string teacherProfileId)
        {
            return await _context.LessonPlans
                .Where(lp => lp.TeacherProfileId == teacherProfileId)
                .OrderByDescending(lp => lp.ScheduledDate)
                .ToListAsync();
        }

        public async Task<LessonPlanEntity> CreateLessonPlanAsync(LessonPlanEntity lessonPlan)
        {
            _context.LessonPlans.Add(lessonPlan);
            await _context.SaveChangesAsync();
            return lessonPlan;
        }

        public async Task<LessonPlanEntity> UpdateLessonPlanAsync(LessonPlanEntity lessonPlan)
        {
            lessonPlan.UpdatedAt = DateTime.UtcNow;
            _context.LessonPlans.Update(lessonPlan);
            await _context.SaveChangesAsync();
            return lessonPlan;
        }

        public async Task<bool> DeleteLessonPlanAsync(string id)
        {
            var lessonPlan = await _context.LessonPlans.FindAsync(id);
            if (lessonPlan == null) return false;

            _context.LessonPlans.Remove(lessonPlan);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TeacherStudentEntity>> GetTeacherStudentsAsync(string teacherProfileId)
        {
            var bookings = await _context.Bookings
                .Where(b => b.TeacherId == teacherProfileId)
                .ToListAsync();

            var studentIds = bookings.Select(b => b.StudentId).Distinct().ToList();

            if (!studentIds.Any())
                return new List<TeacherStudentEntity>();

            var students = await _context.StudentProfiles
                .Where(s => studentIds.Contains(s.UserId))
                .Select(s => new TeacherStudentEntity
                {
                    Id = s.Id,
                    StudentId = s.UserId,
                    StudentName = s.FullName,
                    Grade = s.GradeLevel,
                    EnrolledDate = s.CreatedAt
                })
                .ToListAsync();

            return students;
        }


        public async Task<TeacherStudentEntity> AddTeacherStudentAsync(TeacherStudentEntity relationship)
        {
            _context.TeacherStudents.Add(relationship);
            await _context.SaveChangesAsync();
            return relationship;
        }

        public async Task<bool> RemoveTeacherStudentAsync(string teacherProfileId, string studentId)
        {
            var relationship = await _context.TeacherStudents
                .FirstOrDefaultAsync(ts => ts.TeacherProfileId == teacherProfileId && ts.StudentId == studentId);
            
            if (relationship == null) return false;

            relationship.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<TeacherAvailabilitySlotEntity>> GetAvailabilitySlotsAsync(string teacherProfileId, DateTime? startDate = null, DateTime? endDate = null)
        {
            var query = _context.TeacherAvailabilitySlots
                .Where(s => s.TeacherProfileId == teacherProfileId)
                .AsQueryable();

            if (startDate.HasValue)
            {
                query = query.Where(s => s.Date.Date >= startDate.Value.Date);
            }

            if (endDate.HasValue)
            {
                query = query.Where(s => s.Date.Date <= endDate.Value.Date);
            }

            return await query
                .OrderBy(s => s.Date)
                .ThenBy(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<TeacherAvailabilitySlotEntity?> GetAvailabilitySlotAsync(string teacherProfileId, DateTime date, string startTime, string endTime)
        {
            return await _context.TeacherAvailabilitySlots.FirstOrDefaultAsync(s =>
                s.TeacherProfileId == teacherProfileId &&
                s.Date.Date == date.Date &&
                s.StartTime == startTime &&
                s.EndTime == endTime);
        }

        public async Task<TeacherAvailabilitySlotEntity> AddAvailabilitySlotAsync(TeacherAvailabilitySlotEntity slot)
        {
            _context.TeacherAvailabilitySlots.Add(slot);
            await _context.SaveChangesAsync();
            return slot;
        }

        public async Task<bool> UpdateAvailabilitySlotStatusAsync(string slotId, string status, string? bookingId = null)
        {
            var slot = await _context.TeacherAvailabilitySlots.FindAsync(slotId);
            if (slot == null) return false;

            slot.Status = status;
            slot.BookingId = bookingId;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TeacherAvailabilitySlotEntity?> GetAvailabilitySlotByBookingAsync(string bookingId)
        {
            return await _context.TeacherAvailabilitySlots.FirstOrDefaultAsync(s => s.BookingId == bookingId);
        }

        public async Task<bool> ReleaseSlotByBookingAsync(string bookingId)
        {
            var slot = await _context.TeacherAvailabilitySlots.FirstOrDefaultAsync(s => s.BookingId == bookingId);
            if (slot == null) return false;

            slot.Status = "Available";
            slot.BookingId = null;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAvailabilitySlotAsync(string slotId, string teacherProfileId)
        {
            var slot = await _context.TeacherAvailabilitySlots.FirstOrDefaultAsync(s =>
                s.Id == slotId && s.TeacherProfileId == teacherProfileId);

            if (slot == null) return false;
            if (slot.Status == "Pending" || slot.Status == "Booked") return false;

            _context.TeacherAvailabilitySlots.Remove(slot);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

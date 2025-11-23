using ClassBooking.API.Models;
using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface ITeacherService
    {
        Task<List<TeacherProfile>> GetAllTeachersAsync();
        Task<TeacherProfile?> GetTeacherByIdAsync(string id);
        Task<TeacherProfile?> GetTeacherByUserIdAsync(string userId);
        Task<List<TeacherProfile>> SearchTeachersAsync(string? subject, string? level, string? medium);
        Task<List<TeacherProfile>> GetTopRatedTeachersAsync(int limit = 10);
        Task<TeacherProfile> CreateTeacherAsync(TeacherProfile profile);
        Task<TeacherProfile> UpdateTeacherProfileAsync(string teacherProfileId, TeacherProfile updates);
        Task<TeacherSubject> AddSubjectAsync(string teacherProfileId, TeacherSubject subject);
        Task<bool> RemoveSubjectAsync(string subjectId);
        Task UpdateAvailabilityAsync(string teacherProfileId, List<TeacherAvailability> availability);
        Task<List<ReviewDto>> GetTeacherReviewsAsync(string teacherProfileId);
        Task<ReviewDto> AddReviewAsync(string teacherProfileId, string studentId, string studentName, int rating, string? comment);
    }

    public class TeacherService : ITeacherService
    {
        private readonly ITeacherRepository _repository;

        public TeacherService(ITeacherRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<TeacherProfile>> GetAllTeachersAsync()
        {
            var entities = await _repository.GetAllTeachersAsync();
            return entities.Select(MapToDto).ToList();
        }

        public async Task<TeacherProfile?> GetTeacherByIdAsync(string id)
        {
            var entity = await _repository.GetTeacherByIdAsync(id);
            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<TeacherProfile?> GetTeacherByUserIdAsync(string userId)
        {
            var entity = await _repository.GetTeacherByUserIdAsync(userId);
            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<List<TeacherProfile>> SearchTeachersAsync(string? subject, string? level, string? medium)
        {
            var entities = await _repository.SearchTeachersAsync(subject, level, medium);
            return entities.Select(MapToDto).ToList();
        }

        public async Task<List<TeacherProfile>> GetTopRatedTeachersAsync(int limit = 10)
        {
            var entities = await _repository.GetTopRatedTeachersAsync(limit);
            return entities.Select(MapToDto).ToList();
        }

        public async Task<TeacherProfile> CreateTeacherAsync(TeacherProfile profile)
        {
            var entity = MapToEntity(profile);
            var created = await _repository.CreateTeacherAsync(entity);
            return MapToDto(created);
        }

        public async Task<TeacherProfile> UpdateTeacherProfileAsync(string teacherProfileId, TeacherProfile updates)
        {
            var existing = await _repository.GetTeacherByIdAsync(teacherProfileId);
            if (existing == null)
                throw new InvalidOperationException("Teacher profile not found");

            // Update only the fields that are provided
            if (!string.IsNullOrEmpty(updates.Bio)) existing.Bio = updates.Bio;
            if (updates.HourlyRate > 0) existing.HourlyRate = updates.HourlyRate;
            if (updates.ExperienceYears >= 0) existing.ExperienceYears = updates.ExperienceYears;
            if (!string.IsNullOrEmpty(updates.ProfilePicture)) existing.ProfilePicture = updates.ProfilePicture;
            existing.IsAvailable = updates.IsAvailable;

            var updated = await _repository.UpdateTeacherAsync(existing);
            return MapToDto(updated);
        }

        public async Task<TeacherSubject> AddSubjectAsync(string teacherProfileId, TeacherSubject subject)
        {
            var subjectEntity = new TeacherSubjectEntity
            {
                TeacherProfileId = teacherProfileId,
                Name = subject.Name,
                Medium = subject.Medium,
                Level = subject.Level
            };

            var created = await _repository.AddSubjectAsync(subjectEntity);
            return new TeacherSubject
            {
                Id = created.Id,
                Name = created.Name,
                Medium = created.Medium,
                Level = created.Level
            };
        }

        public async Task<bool> RemoveSubjectAsync(string subjectId)
        {
            return await _repository.RemoveSubjectAsync(subjectId);
        }

        public async Task UpdateAvailabilityAsync(string teacherProfileId, List<TeacherAvailability> availability)
        {
            var entities = availability.Select(a => new TeacherAvailabilityEntity
            {
                TeacherProfileId = teacherProfileId,
                DayOfWeek = a.DayOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime
            }).ToList();

            await _repository.UpdateTeacherAvailabilityAsync(teacherProfileId, entities);
        }

        public async Task<List<ReviewDto>> GetTeacherReviewsAsync(string teacherProfileId)
        {
            var reviews = await _repository.GetTeacherReviewsAsync(teacherProfileId);
            return reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                StudentName = r.StudentName,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();
        }

        public async Task<ReviewDto> AddReviewAsync(string teacherProfileId, string studentId, string studentName, int rating, string? comment)
        {
            var review = new ReviewEntity
            {
                TeacherProfileId = teacherProfileId,
                StudentId = studentId,
                StudentName = studentName,
                Rating = rating,
                Comment = comment
            };

            var created = await _repository.AddReviewAsync(review);
            return new ReviewDto
            {
                Id = created.Id,
                StudentName = created.StudentName,
                Rating = created.Rating,
                Comment = created.Comment,
                CreatedAt = created.CreatedAt
            };
        }

        // Mapping helpers
        private TeacherProfile MapToDto(TeacherProfileEntity entity)
        {
            return new TeacherProfile
            {
                Id = entity.Id,
                UserId = entity.UserId,
                FullName = entity.FullName,
                Email = entity.Email,
                PhoneNumber = entity.PhoneNumber,
                ProfilePicture = entity.ProfilePicture,
                Bio = entity.Bio,
                Qualifications = entity.Qualifications.Select(q => q.Qualification).ToList(),
                Subjects = entity.Subjects.Select(s => new TeacherSubject
                {
                    Id = s.Id,
                    Name = s.Name,
                    Medium = s.Medium,
                    Level = s.Level
                }).ToList(),
                HourlyRate = entity.HourlyRate,
                ExperienceYears = entity.ExperienceYears,
                AverageRating = entity.AverageRating,
                TotalReviews = entity.TotalReviews,
                TotalClasses = entity.TotalClasses,
                IsAvailable = entity.IsAvailable,
                Availability = entity.Availability.Select(a => new TeacherAvailability
                {
                    DayOfWeek = a.DayOfWeek,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime
                }).ToList(),
                VerificationStatus = entity.VerificationStatus,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        private TeacherProfileEntity MapToEntity(TeacherProfile dto)
        {
            var entity = new TeacherProfileEntity
            {
                Id = dto.Id,
                UserId = dto.UserId,
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                ProfilePicture = dto.ProfilePicture,
                Bio = dto.Bio,
                HourlyRate = dto.HourlyRate,
                ExperienceYears = dto.ExperienceYears,
                IsAvailable = dto.IsAvailable,
                VerificationStatus = dto.VerificationStatus
            };

            // Add qualifications
            if (dto.Qualifications != null)
            {
                entity.Qualifications = dto.Qualifications.Select(q => new TeacherQualificationEntity
                {
                    TeacherProfileId = entity.Id,
                    Qualification = q
                }).ToList();
            }

            // Add subjects
            if (dto.Subjects != null)
            {
                entity.Subjects = dto.Subjects.Select(s => new TeacherSubjectEntity
                {
                    Id = s.Id,
                    TeacherProfileId = entity.Id,
                    Name = s.Name,
                    Medium = s.Medium,
                    Level = s.Level
                }).ToList();
            }

            // Add availability
            if (dto.Availability != null)
            {
                entity.Availability = dto.Availability.Select(a => new TeacherAvailabilityEntity
                {
                    TeacherProfileId = entity.Id,
                    DayOfWeek = a.DayOfWeek,
                    StartTime = a.StartTime,
                    EndTime = a.EndTime
                }).ToList();
            }

            return entity;
        }
    }

    public class ReviewDto
    {
        public string Id { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

using ClassBooking.API.Entities;
using ClassBooking.API.Models.Dto;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface ITimetableService
    {
        Task<List<TimetableEventDto>> GetEventsAsync(DateTime? from = null, DateTime? to = null);
        Task<List<TimetableEventDto>> GetEventsForAudienceAsync(string audience, DateTime? from = null, DateTime? to = null);
        Task<TimetableEventDto?> GetEventAsync(string id);
        Task<TimetableEventDto> CreateAsync(TimetableEventDto dto, string createdBy);
        Task<TimetableEventDto?> UpdateAsync(string id, TimetableEventDto dto);
        Task<bool> DeleteAsync(string id);
    }

    public class TimetableService : ITimetableService
    {
        private readonly ITimetableRepository _repository;

        public TimetableService(ITimetableRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<TimetableEventDto>> GetEventsAsync(DateTime? from = null, DateTime? to = null)
        {
            var events = await _repository.GetAllAsync(from, to);
            return events.Select(MapToDto).ToList();
        }

        public async Task<List<TimetableEventDto>> GetEventsForAudienceAsync(string audience, DateTime? from = null, DateTime? to = null)
        {
            var events = await _repository.GetByAudienceAsync(audience, from, to);
            return events.Select(MapToDto).ToList();
        }

        public async Task<TimetableEventDto?> GetEventAsync(string id)
        {
            var evt = await _repository.GetByIdAsync(id);
            return evt != null ? MapToDto(evt) : null;
        }

        public async Task<TimetableEventDto> CreateAsync(TimetableEventDto dto, string createdBy)
        {
            var entity = new TimetableEventEntity
            {
                Title = dto.Title,
                Description = dto.Description,
                Date = dto.Date.Date,
                StartTime = dto.StartTime ?? "00:00",
                EndTime = dto.EndTime ?? "00:00",
                Type = dto.Type ?? "General",
                Audience = dto.Type == "Exam" ? "Students" : dto.Audience ?? "All",
                CreatedBy = createdBy
            };

            var created = await _repository.CreateAsync(entity);
            return MapToDto(created);
        }

        public async Task<TimetableEventDto?> UpdateAsync(string id, TimetableEventDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return null;

            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.Date = dto.Date.Date;
            existing.StartTime = dto.StartTime ?? existing.StartTime;
            existing.EndTime = dto.EndTime ?? existing.EndTime;
            existing.Type = dto.Type ?? existing.Type;
            existing.Audience = dto.Audience ?? existing.Audience;

            var updated = await _repository.UpdateAsync(existing);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteAsync(string id)
        {
            return await _repository.DeleteAsync(id);
        }

        private TimetableEventDto MapToDto(TimetableEventEntity e)
        {
            return new TimetableEventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Date = e.Date,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                Type = e.Type,
                Audience = e.Audience
            };
        }
    }
}

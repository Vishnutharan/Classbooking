using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IBookingRepository
    {
        Task<BookingEntity?> GetByIdAsync(string id);
        Task<List<BookingEntity>> GetByStudentIdAsync(string studentId);
        Task<List<BookingEntity>> GetByTeacherIdAsync(string teacherId);
        Task<List<BookingEntity>> GetAllAsync();
        Task<BookingEntity> CreateAsync(BookingEntity booking);
        Task<BookingEntity> UpdateAsync(BookingEntity booking);
        Task<bool> DeleteAsync(string id);
        Task<List<BookingEntity>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<List<BookingEntity>> GetByStatusAsync(string status);
    }

    public class BookingRepository : IBookingRepository
    {
        private readonly ClassBookingDbContext _context;

        public BookingRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<BookingEntity?> GetByIdAsync(string id)
        {
            return await _context.Bookings.FindAsync(id);
        }

        public async Task<List<BookingEntity>> GetByStudentIdAsync(string studentId)
        {
            return await _context.Bookings
                .Where(b => b.StudentId == studentId)
                .OrderByDescending(b => b.Date)
                .ToListAsync();
        }

        public async Task<List<BookingEntity>> GetByTeacherIdAsync(string teacherId)
        {
            return await _context.Bookings
                .Where(b => b.TeacherId == teacherId)
                .OrderByDescending(b => b.Date)
                .ToListAsync();
        }

        public async Task<List<BookingEntity>> GetAllAsync()
        {
            return await _context.Bookings
                .OrderByDescending(b => b.Date)
                .ToListAsync();
        }

        public async Task<BookingEntity> CreateAsync(BookingEntity booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<BookingEntity> UpdateAsync(BookingEntity booking)
        {
            booking.UpdatedAt = DateTime.UtcNow;
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var booking = await GetByIdAsync(id);
            if (booking == null) return false;

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<BookingEntity>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Bookings
                .Where(b => b.Date >= startDate && b.Date <= endDate)
                .OrderBy(b => b.Date)
                .ToListAsync();
        }

        public async Task<List<BookingEntity>> GetByStatusAsync(string status)
        {
            return await _context.Bookings
                .Where(b => b.Status == status)
                .OrderByDescending(b => b.Date)
                .ToListAsync();
        }
    }
}

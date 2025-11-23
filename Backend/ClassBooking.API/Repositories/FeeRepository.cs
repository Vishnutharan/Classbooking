using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IFeeRepository
    {
        Task<List<FeeTransactionEntity>> GetByStudentIdAsync(string studentId);
        Task<List<FeeTransactionEntity>> GetByBookingIdAsync(string bookingId);
        Task<FeeTransactionEntity> CreateAsync(FeeTransactionEntity transaction);
        Task<FeeTransactionEntity?> GetByIdAsync(string id);
        Task<FeeTransactionEntity> UpdateAsync(FeeTransactionEntity transaction);
        Task<List<FeeTransactionEntity>> GetPendingByStudentAsync(string studentId);
        Task<decimal> GetTotalEarningsAsync(string teacherId, DateTime? fromDate = null);
    }

    public class FeeRepository : IFeeRepository
    {
        private readonly ClassBookingDbContext _context;

        public FeeRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<List<FeeTransactionEntity>> GetByStudentIdAsync(string studentId)
        {
            return await _context.FeeTransactions
                .Where(f => f.StudentId == studentId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<FeeTransactionEntity>> GetByBookingIdAsync(string bookingId)
        {
            return await _context.FeeTransactions
                .Where(f => f.BookingId == bookingId)
                .ToListAsync();
        }

        public async Task<FeeTransactionEntity> CreateAsync(FeeTransactionEntity transaction)
        {
            _context.FeeTransactions.Add(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<FeeTransactionEntity?> GetByIdAsync(string id)
        {
            return await _context.FeeTransactions.FindAsync(id);
        }

        public async Task<FeeTransactionEntity> UpdateAsync(FeeTransactionEntity transaction)
        {
            _context.FeeTransactions.Update(transaction);
            await _context.SaveChangesAsync();
            return transaction;
        }

        public async Task<List<FeeTransactionEntity>> GetPendingByStudentAsync(string studentId)
        {
            return await _context.FeeTransactions
                .Where(f => f.StudentId == studentId && f.Status == "Pending")
                .OrderBy(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalEarningsAsync(string teacherId, DateTime? fromDate = null)
        {
            var query = _context.FeeTransactions
                .Join(_context.Bookings,
                    fee => fee.BookingId,
                    booking => booking.Id,
                    (fee, booking) => new { Fee = fee, Booking = booking })
                .Where(x => x.Booking.TeacherId == teacherId && x.Fee.Status == "Paid");

            if (fromDate.HasValue)
                query = query.Where(x => x.Fee.TransactionDate >= fromDate);

            return await query.SumAsync(x => x.Fee.Amount);
        }
    }
}

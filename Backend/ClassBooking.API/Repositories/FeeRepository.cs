using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IFeeRepository
    {
        Task<List<FeeTransactionEntity>> GetByStudentIdAsync(string studentId);
        Task<List<FeeTransactionEntity>> GetByBookingIdAsync(string bookingId);
        Task<List<FeeTransactionEntity>> GetByTeacherIdAsync(string teacherId);
        Task<List<FeeTransactionEntity>> GetAllAsync();
        Task<FeeTransactionEntity> CreateAsync(FeeTransactionEntity transaction);
        Task<FeeTransactionEntity?> GetByIdAsync(string id);
        Task<FeeTransactionEntity> UpdateAsync(FeeTransactionEntity transaction);
        Task<List<FeeTransactionEntity>> GetPendingByStudentAsync(string studentId);
        Task<decimal> GetTotalEarningsAsync(string teacherId, DateTime? fromDate = null);
        Task<decimal> GetTotalRevenueAsync();
        Task<List<(string label, decimal value)>> GetMonthlyRevenueAsync(int months);
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

        public async Task<List<FeeTransactionEntity>> GetByTeacherIdAsync(string teacherId)
        {
            return await _context.FeeTransactions
                .Join(_context.Bookings,
                    fee => fee.BookingId,
                    booking => booking.Id,
                    (fee, booking) => new { fee, booking })
                .Where(x => x.booking.TeacherId == teacherId)
                .Select(x => x.fee)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<FeeTransactionEntity>> GetAllAsync()
        {
            return await _context.FeeTransactions
                .OrderByDescending(f => f.CreatedAt)
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

        public async Task<decimal> GetTotalRevenueAsync()
        {
            return await _context.FeeTransactions
                .Where(f => f.Status == "Paid")
                .SumAsync(f => f.Amount);
        }

        public async Task<List<(string label, decimal value)>> GetMonthlyRevenueAsync(int months)
        {
            var cutoff = DateTime.UtcNow.AddMonths(-months + 1);

            var grouped = await _context.FeeTransactions
                .Where(f => f.Status == "Paid" && (f.TransactionDate ?? f.CreatedAt) >= cutoff)
                .GroupBy(f => new { Month = (f.TransactionDate ?? f.CreatedAt).Month, Year = (f.TransactionDate ?? f.CreatedAt).Year })
                .Select(g => new
                {
                    g.Key.Year,
                    g.Key.Month,
                    Total = g.Sum(x => x.Amount)
                })
                .ToListAsync();

            var points = new List<(string label, decimal value)>();
            for (int i = months - 1; i >= 0; i--)
            {
                var date = DateTime.UtcNow.AddMonths(-i);
                var match = grouped.FirstOrDefault(g => g.Year == date.Year && g.Month == date.Month);
                var label = date.ToString("MMM");
                points.Add((label, match?.Total ?? 0));
            }

            return points;
        }
    }
}

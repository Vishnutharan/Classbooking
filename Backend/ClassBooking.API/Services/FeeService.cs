using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;

namespace ClassBooking.API.Services
{
    public interface IFeeService
    {
        Task<List<FeeTransactionEntity>> GetStudentTransactionsAsync(string studentId);
        Task<decimal> GetTeacherTotalEarningsAsync(string teacherId, DateTime? fromDate = null);
        Task<FeeTransactionEntity> ProcessPaymentAsync(FeeTransactionEntity transaction);
    }

    public class FeeService : IFeeService
    {
        private readonly IFeeRepository _feeRepository;

        public FeeService(IFeeRepository feeRepository)
        {
            _feeRepository = feeRepository;
        }

        public async Task<List<FeeTransactionEntity>> GetStudentTransactionsAsync(string studentId)
        {
            return await _feeRepository.GetByStudentIdAsync(studentId);
        }

        public async Task<decimal> GetTeacherTotalEarningsAsync(string teacherId, DateTime? fromDate = null)
        {
            return await _feeRepository.GetTotalEarningsAsync(teacherId, fromDate);
        }

        public async Task<FeeTransactionEntity> ProcessPaymentAsync(FeeTransactionEntity transaction)
        {
            // In a real app, integrate with payment gateway here
            transaction.Status = "Paid";
            transaction.TransactionDate = DateTime.UtcNow;
            return await _feeRepository.CreateAsync(transaction);
        }
    }
}

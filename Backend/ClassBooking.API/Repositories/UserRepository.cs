using ClassBooking.API.Data;
using ClassBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(string id);
        Task<string> CreateUserAsync(User user);
    }

    public class UserRepository : IUserRepository
    {
        private readonly ClassBookingDbContext _context;

        public UserRepository(ClassBookingDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(string id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<string> CreateUserAsync(User user)
        {
            user.Id = Guid.NewGuid().ToString();
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }
    }
}

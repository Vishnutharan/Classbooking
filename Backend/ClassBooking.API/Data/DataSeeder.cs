using ClassBooking.API.Data;
using ClassBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Data
{
    public static class DataSeeder
    {
        public static async Task SeedData(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ClassBookingDbContext>();

            // Apply migrations
            await context.Database.MigrateAsync();

            // Seed Admin User
            var adminEmail = "admin@classbooking.com";
            var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);

            if (adminUser == null)
            {
                adminUser = new User
                {
                    Email = adminEmail,
                    FullName = "System Admin",
                    Role = "Admin",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("AdminPassword123!"),
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }
        }
    }
}

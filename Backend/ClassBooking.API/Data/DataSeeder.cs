using ClassBooking.API.Data;
using ClassBooking.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace ClassBooking.API.Data
{
    public static class DataSeeder
    {
        public static async Task SeedData(IServiceProvider serviceProvider)
        {
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ClassBookingDbContext>();
                
                if (context.StudentProfiles.Any())
                    return;

                var studentProfiles = new List<StudentProfileEntity>
                {
                    new StudentProfileEntity
                    {
                        Id = "student-1",
                        UserId = "user-student-1",
                        FullName = "Ahmed Mohamed",
                        Email = "ahmed@example.com",
                        PhoneNumber = "+94712345678",
                        GradeLevel = "10",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new StudentProfileEntity
                    {
                        Id = "student-2",
                        UserId = "user-student-2",
                        FullName = "Fatima Hassan",
                        Email = "fatima@example.com",
                        PhoneNumber = "+94723456789",
                        GradeLevel = "11",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new StudentProfileEntity
                    {
                        Id = "student-3",
                        UserId = "user-student-3",
                        FullName = "Ali Khan",
                        Email = "ali@example.com",
                        PhoneNumber = "+94734567890",
                        GradeLevel = "9",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                await context.StudentProfiles.AddRangeAsync(studentProfiles);

                var bookings = new List<BookingEntity>
                {
                    new BookingEntity
                    {
                        Id = "booking-1",
                        StudentId = "user-student-1",
                        TeacherId = "teacher-id-1",
                        Subject = "Mathematics",
                        Date = DateTime.UtcNow.AddDays(5),
                        StartTime = "14:00",
                        EndTime = "15:00",
                        Status = "Confirmed",
                        ClassType = "Online",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new BookingEntity
                    {
                        Id = "booking-2",
                        StudentId = "user-student-2",
                        TeacherId = "teacher-id-1",
                        Subject = "English",
                        Date = DateTime.UtcNow.AddDays(7),
                        StartTime = "15:00",
                        EndTime = "16:00",
                        Status = "Confirmed",
                        ClassType = "Online",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new BookingEntity
                    {
                        Id = "booking-3",
                        StudentId = "user-student-3",
                        TeacherId = "teacher-id-1",
                        Subject = "Science",
                        Date = DateTime.UtcNow.AddDays(3),
                        StartTime = "16:00",
                        EndTime = "17:00",
                        Status = "Completed",
                        ClassType = "Online",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                await context.Bookings.AddRangeAsync(bookings);
                await context.SaveChangesAsync();
            }
        }
    }
}
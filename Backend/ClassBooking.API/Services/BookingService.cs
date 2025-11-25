using ClassBooking.API.Models;
using ClassBooking.API.Entities;
using ClassBooking.API.Repositories;
using System.Text.Json;

namespace ClassBooking.API.Services
{
    public interface IBookingService
    {
        Task<List<Models.ClassBooking>> GetBookingsForStudentAsync(string studentId);
        Task<List<Models.ClassBooking>> GetBookingsForTeacherAsync(string teacherId);
        Task<Models.ClassBooking?> GetBookingByIdAsync(string id);
        Task<List<Models.ClassBooking>> GetAllBookingsAsync();
        Task<BookingResponse> CreateBookingAsync(string studentId, BookingRequest request);
        Task<BookingResponse> UpdateBookingAsync(string id, BookingRequest request);
        Task<BookingResponse> ConfirmBookingAsync(string id);
        Task<BookingResponse> CancelBookingAsync(string id, string? reason);
        Task<BookingResponse> CompleteBookingAsync(string id);
        Task<List<string>> GetAvailableSlotsAsync(string teacherId, DateTime date);
        Task<BookingResponse> RescheduleBookingAsync(string id, DateTime newDate, string newStartTime, string newEndTime);
    }

    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IEmailService _emailService;
        private readonly IUserRepository _userRepository;

        public BookingService(
            IBookingRepository bookingRepository,
            ITeacherRepository teacherRepository,
            INotificationRepository notificationRepository,
            IEmailService emailService,
            IUserRepository userRepository)
        {
            _bookingRepository = bookingRepository;
            _teacherRepository = teacherRepository;
            _notificationRepository = notificationRepository;
            _emailService = emailService;
            _userRepository = userRepository;
        }

        public async Task<List<Models.ClassBooking>> GetBookingsForStudentAsync(string studentId)
        {
            var bookings = await _bookingRepository.GetByStudentIdAsync(studentId);
            var dtos = new List<Models.ClassBooking>();
            
            foreach (var booking in bookings)
            {
                var dto = MapToDto(booking);
                var teacher = await _userRepository.GetByIdAsync(booking.TeacherId);
                var student = await _userRepository.GetByIdAsync(booking.StudentId);
                dto.TeacherName = teacher?.FullName ?? "Unknown";
                dto.StudentName = student?.FullName ?? "Unknown";
                dtos.Add(dto);
            }
            return dtos;
        }

        public async Task<List<Models.ClassBooking>> GetBookingsForTeacherAsync(string teacherId)
        {
            var bookings = await _bookingRepository.GetByTeacherIdAsync(teacherId);
            var dtos = new List<Models.ClassBooking>();

            foreach (var booking in bookings)
            {
                var dto = MapToDto(booking);
                var student = await _userRepository.GetByIdAsync(booking.StudentId);
                var teacher = await _userRepository.GetByIdAsync(booking.TeacherId);
                dto.StudentName = student?.FullName ?? "Unknown";
                dto.TeacherName = teacher?.FullName ?? "Unknown";
                dtos.Add(dto);
            }
            return dtos;
        }

        public async Task<Models.ClassBooking?> GetBookingByIdAsync(string id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null) return null;

            var dto = MapToDto(booking);
            var student = await _userRepository.GetByIdAsync(booking.StudentId);
            var teacher = await _userRepository.GetByIdAsync(booking.TeacherId);
            dto.StudentName = student?.FullName ?? "Unknown";
            dto.TeacherName = teacher?.FullName ?? "Unknown";
            
            return dto;
        }

        public async Task<List<Models.ClassBooking>> GetAllBookingsAsync()
        {
            var bookings = await _bookingRepository.GetAllAsync();
            var dtos = new List<Models.ClassBooking>();

            foreach (var booking in bookings)
            {
                var dto = MapToDto(booking);
                var student = await _userRepository.GetByIdAsync(booking.StudentId);
                var teacher = await _userRepository.GetByIdAsync(booking.TeacherId);
                dto.StudentName = student?.FullName ?? "Unknown";
                dto.TeacherName = teacher?.FullName ?? "Unknown";
                dtos.Add(dto);
            }
            return dtos;
        }

        public async Task<BookingResponse> CreateBookingAsync(string studentId, BookingRequest request)
        {
            var booking = new BookingEntity
            {
                Id = Guid.NewGuid().ToString(),
                StudentId = studentId,
                TeacherId = request.TeacherId,
                Subject = request.Subject,
                Date = request.Date,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Status = "Pending",
                ClassType = request.ClassType,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _bookingRepository.CreateAsync(booking);

            // Create notification for teacher
            await _notificationRepository.CreateAsync(new NotificationEntity
            {
                UserId = request.TeacherId,
                Type = "NewBooking",
                Title = "New Booking Request",
                Message = $"New booking request for {request.Subject} on {request.Date:yyyy-MM-dd}",
                RelatedEntityId = booking.Id,
                CreatedAt = DateTime.UtcNow
            });

            // Send Email to Teacher
            var teacher = await _userRepository.GetByIdAsync(request.TeacherId);
            if (teacher != null)
            {
                await _emailService.SendEmailAsync(teacher.Email, "New Booking Request", 
                    $"You have a new booking request for {request.Subject} on {request.Date:yyyy-MM-dd} at {request.StartTime}.");
            }

            return new BookingResponse
            {
                Id = booking.Id,
                Status = booking.Status,
                Message = "Booking created successfully"
            };
        }

        public async Task<BookingResponse> UpdateBookingAsync(string id, BookingRequest request)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return new BookingResponse { Id = id, Status = "Error", Message = "Booking not found" };

            booking.Subject = request.Subject;
            booking.Date = request.Date;
            booking.StartTime = request.StartTime;
            booking.EndTime = request.EndTime;
            booking.Notes = request.Notes;

            await _bookingRepository.UpdateAsync(booking);

            return new BookingResponse
            {
                Id = booking.Id,
                Status = booking.Status,
                Message = "Booking updated successfully"
            };
        }

        public async Task<BookingResponse> ConfirmBookingAsync(string id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return new BookingResponse { Id = id, Status = "Error", Message = "Booking not found" };

            booking.Status = "Confirmed";
            await _bookingRepository.UpdateAsync(booking);

            // Notify student
            await _notificationRepository.CreateAsync(new NotificationEntity
            {
                UserId = booking.StudentId,
                Type = "BookingConfirmed",
                Title = "Booking Confirmed",
                Message = $"Your booking for {booking.Subject} on {booking.Date:yyyy-MM-dd} has been confirmed",
                RelatedEntityId = booking.Id,
                CreatedAt = DateTime.UtcNow
            });

            // Send Email to Student
            var student = await _userRepository.GetByIdAsync(booking.StudentId);
            if (student != null)
            {
                await _emailService.SendEmailAsync(student.Email, "Booking Confirmed", 
                    $"Your booking for {booking.Subject} on {booking.Date:yyyy-MM-dd} at {booking.StartTime} has been confirmed.");
            }

            return new BookingResponse
            {
                Id = booking.Id,
                Status = booking.Status,
                Message = "Booking confirmed"
            };
        }

        public async Task<BookingResponse> CancelBookingAsync(string id, string? reason)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return new BookingResponse { Id = id, Status = "Error", Message = "Booking not found" };

            booking.Status = "Cancelled";
            booking.CancellationReason = reason;
            await _bookingRepository.UpdateAsync(booking);

            // Notify both parties
            await _notificationRepository.CreateAsync(new NotificationEntity
            {
                UserId = booking.StudentId,
                Type = "BookingCancelled",
                Title = "Booking Cancelled",
                Message = $"Your booking for {booking.Subject} on {booking.Date:yyyy-MM-dd} has been cancelled",
                RelatedEntityId = booking.Id,
                CreatedAt = DateTime.UtcNow
            });

            // Send Email to Student
            var student = await _userRepository.GetByIdAsync(booking.StudentId);
            if (student != null)
            {
                await _emailService.SendEmailAsync(student.Email, "Booking Cancelled", 
                    $"Your booking for {booking.Subject} on {booking.Date:yyyy-MM-dd} has been cancelled. Reason: {reason}");
            }

            // Send Email to Teacher (if cancelled by student) - Logic could be refined based on who cancelled
            var teacher = await _userRepository.GetByIdAsync(booking.TeacherId);
            if (teacher != null)
            {
                await _emailService.SendEmailAsync(teacher.Email, "Booking Cancelled", 
                    $"The booking for {booking.Subject} on {booking.Date:yyyy-MM-dd} has been cancelled. Reason: {reason}");
            }

            return new BookingResponse
            {
                Id = booking.Id,
                Status = booking.Status,
                Message = "Booking cancelled"
            };
        }

        public async Task<BookingResponse> CompleteBookingAsync(string id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return new BookingResponse { Id = id, Status = "Error", Message = "Booking not found" };

            booking.Status = "Completed";
            await _bookingRepository.UpdateAsync(booking);

            return new BookingResponse
            {
                Id = booking.Id,
                Status = booking.Status,
                Message = "Booking marked as completed"
            };
        }

        public async Task<List<string>> GetAvailableSlotsAsync(string teacherId, DateTime date)
        {
            // Get teacher's availability for the day
            var teacher = await _teacherRepository.GetByIdAsync(teacherId);
            if (teacher == null) return new List<string>();

            var dayOfWeek = date.DayOfWeek.ToString();
            var availability = teacher.Availability.FirstOrDefault(a => a.DayOfWeek == dayOfWeek);
            if (availability == null) return new List<string>();

            // Get existing bookings for that day
            var bookings = await _bookingRepository.GetByTeacherIdAsync(teacherId);
            var dayBookings = bookings.Where(b => b.Date.Date == date.Date && 
                (b.Status == "Confirmed" || b.Status == "Pending")).ToList();

            // Generate time slots (assuming 1-hour slots)
            var slots = new List<string>();
            var startHour = int.Parse(availability.StartTime.Split(':')[0]);
            var endHour = int.Parse(availability.EndTime.Split(':')[0]);

            for (int hour = startHour; hour < endHour; hour++)
            {
                var slotTime = $"{hour:D2}:00";
                var isBooked = dayBookings.Any(b => b.StartTime == slotTime);
                if (!isBooked)
                {
                    slots.Add(slotTime);
                }
            }

            return slots;
        }

        public async Task<BookingResponse> RescheduleBookingAsync(string id, DateTime newDate, string newStartTime, string newEndTime)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking == null)
                return new BookingResponse { Id = id, Status = "Error", Message = "Booking not found" };

            booking.Date = newDate;
            booking.StartTime = newStartTime;
            booking.EndTime = newEndTime;
            await _bookingRepository.UpdateAsync(booking);

            // Notify both parties
            await _notificationRepository.CreateAsync(new NotificationEntity
            {
                UserId = booking.StudentId,
                Type = "BookingRescheduled",
                Title = "Booking Rescheduled",
                Message = $"Your booking has been rescheduled to {newDate:yyyy-MM-dd} at {newStartTime}",
                RelatedEntityId = booking.Id,
                CreatedAt = DateTime.UtcNow
            });

            // Send Email to Student
            var student = await _userRepository.GetByIdAsync(booking.StudentId);
            if (student != null)
            {
                await _emailService.SendEmailAsync(student.Email, "Booking Rescheduled", 
                    $"Your booking has been rescheduled to {newDate:yyyy-MM-dd} at {newStartTime}.");
            }

            return new BookingResponse
            {
                Id = booking.Id,
                Status = booking.Status,
                Message = "Booking rescheduled successfully"
            };
        }

        private Models.ClassBooking MapToDto(BookingEntity entity)
        {
            return new Models.ClassBooking
            {
                Id = entity.Id,
                StudentId = entity.StudentId,
                TeacherId = entity.TeacherId,
                Subject = entity.Subject,
                Date = entity.Date,
                StartTime = entity.StartTime,
                EndTime = entity.EndTime,
                Status = entity.Status,
                ClassType = entity.ClassType,
                RecurringDays = !string.IsNullOrEmpty(entity.RecurringDaysJson) 
                    ? JsonSerializer.Deserialize<List<string>>(entity.RecurringDaysJson) 
                    : null,
                Notes = entity.Notes,
                MeetingLink = entity.MeetingLink,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }
    }
}

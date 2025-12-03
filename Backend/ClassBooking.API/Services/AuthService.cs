using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using ClassBooking.API.Models;
using ClassBooking.API.Models.Dto;
using ClassBooking.API.Repositories;
using ClassBooking.API.Entities;
using Microsoft.IdentityModel.Tokens;
using ClassBooking.API.Data;

namespace ClassBooking.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITeacherRepository _teacherRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IConfiguration _configuration;

        private readonly ClassBookingDbContext _context;

        public AuthService(
            IUserRepository userRepository,
            ITeacherRepository teacherRepository,
            IStudentRepository studentRepository,
            IConfiguration configuration,
            ClassBookingDbContext context)
        {
            _userRepository = userRepository;
            _teacherRepository = teacherRepository;
            _studentRepository = studentRepository;
            _configuration = configuration;
            _context = context;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Check if user exists
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    throw new Exception("Email already exists.");
                }

                // Hash password
                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create user
                var newUser = new User
                {
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    FullName = request.FullName,
                    Role = request.Role
                };

                string userId = await _userRepository.CreateUserAsync(newUser);
                newUser.Id = userId;

                // Create Profile based on Role
                if (request.Role == "Teacher")
                {
                    var teacherProfile = new TeacherProfileEntity
                    {
                        UserId = userId,
                        FullName = request.FullName,
                        Email = request.Email,
                        PhoneNumber = request.PhoneNumber ?? "",
                        HourlyRate = 0,
                        ExperienceYears = 0,
                        AverageRating = 0,
                        TotalReviews = 0,
                        TotalClasses = 0,
                        IsAvailable = true, // Default to available
                        VerificationStatus = "Pending",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    await _teacherRepository.CreateTeacherAsync(teacherProfile);
                }
                else if (request.Role == "Student")
                {
                    var studentProfile = new StudentProfileEntity
                    {
                        UserId = userId,
                        FullName = request.FullName,
                        Email = request.Email,
                        PhoneNumber = request.PhoneNumber ?? "",
                        GradeLevel = "OLevel", // Default
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };
                    await _studentRepository.CreateAsync(studentProfile);
                }

                await transaction.CommitAsync();

                // Generate token
                string token = GenerateJwtToken(newUser);

                return new AuthResponse
                {
                    Token = token,
                    RefreshToken = "dummy-refresh-token", // Implement real refresh token logic if needed
                    User = MapToDto(newUser)
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials.");
            }

            string token = GenerateJwtToken(user);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = "dummy-refresh-token",
                User = MapToDto(user)
            };
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

            var claims = new List<Claim>
            {
                new Claim("userId", user.Id.ToString()),  // Controllers expect "userId"
                new Claim("email", user.Email),
                new Claim("role", user.Role),            // Controllers expect "role"
                new Claim("fullName", user.FullName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // Also add standard claims
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpireMinutes"]!)),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role,
                ProfilePicture = user.ProfilePicture,
                Bio = user.Bio,
                PhoneNumber = user.PhoneNumber,
                Status = user.Status,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin
            };
        }
    }
}

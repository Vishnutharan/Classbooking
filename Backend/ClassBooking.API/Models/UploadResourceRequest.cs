using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ClassBooking.API.Models
{
    public class UploadResourceRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string Level { get; set; } = string.Empty;

        public string? StudentId { get; set; } // Nullable if general resource, but required for specific student upload per requirement

        [Required]
        public IFormFile File { get; set; }
    }
}

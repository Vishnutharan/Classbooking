using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBookingSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClassTypes",
                table: "TeacherSubjects",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CurriculumBoard",
                table: "TeacherSubjects",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocationAddress",
                table: "TeacherProfiles",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeetingLink",
                table: "TeacherProfiles",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Policies",
                table: "TeacherProfiles",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeachingMode",
                table: "TeacherProfiles",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GuardianInfoJson",
                table: "StudentProfiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "StudentProfiles",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BookingGradeLevel",
                table: "Bookings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "DurationMinutes",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LocationOrLink",
                table: "Bookings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Mode",
                table: "Bookings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "Bookings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Bookings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClassTypes",
                table: "TeacherSubjects");

            migrationBuilder.DropColumn(
                name: "CurriculumBoard",
                table: "TeacherSubjects");

            migrationBuilder.DropColumn(
                name: "LocationAddress",
                table: "TeacherProfiles");

            migrationBuilder.DropColumn(
                name: "MeetingLink",
                table: "TeacherProfiles");

            migrationBuilder.DropColumn(
                name: "Policies",
                table: "TeacherProfiles");

            migrationBuilder.DropColumn(
                name: "TeachingMode",
                table: "TeacherProfiles");

            migrationBuilder.DropColumn(
                name: "GuardianInfoJson",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "Timezone",
                table: "StudentProfiles");

            migrationBuilder.DropColumn(
                name: "BookingGradeLevel",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "DurationMinutes",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "LocationOrLink",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Mode",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Bookings");
        }
    }
}

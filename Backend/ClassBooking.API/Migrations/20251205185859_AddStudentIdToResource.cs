using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentIdToResource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "Resources",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Resources");
        }
    }
}

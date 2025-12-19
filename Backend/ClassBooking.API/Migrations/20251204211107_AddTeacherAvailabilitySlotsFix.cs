using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTeacherAvailabilitySlotsFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeacherAvailabilitySlots",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TeacherProfileId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartTime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EndTime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    BookingId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherAvailabilitySlots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeacherAvailabilitySlots_TeacherProfiles_TeacherProfileId",
                        column: x => x.TeacherProfileId,
                        principalTable: "TeacherProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAvailabilitySlots_TeacherProfileId_Date",
                table: "TeacherAvailabilitySlots",
                columns: new[] { "TeacherProfileId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_TeacherAvailabilitySlots_TeacherProfileId_Status",
                table: "TeacherAvailabilitySlots",
                columns: new[] { "TeacherProfileId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeacherAvailabilitySlots");
        }
    }
}

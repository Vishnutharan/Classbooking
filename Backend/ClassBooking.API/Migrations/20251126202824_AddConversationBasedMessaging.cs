using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddConversationBasedMessaging : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Resources_ExamType",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ReceiverId_IsRead",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "ExamType",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "UploadedBy",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "Year",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "AttachmentUrl",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Messages");

            migrationBuilder.RenameColumn(
                name: "ReceiverId",
                table: "Messages",
                newName: "ConversationId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ReceiverId",
                table: "Messages",
                newName: "IX_Messages_ConversationId");

            migrationBuilder.RenameColumn(
                name: "TargetStudentIdsJson",
                table: "Announcements",
                newName: "RecipientId");

            migrationBuilder.RenameColumn(
                name: "TargetAudience",
                table: "Announcements",
                newName: "RecipientType");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Announcements",
                newName: "SentAt");

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "Resources",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Level",
                table: "Resources",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DownloadCount",
                table: "Resources",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Resources",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "Resources",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "FileSize",
                table: "Resources",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Resources",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "Resources",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "Resources",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeacherProfileId",
                table: "Resources",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Resources",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAt",
                table: "Messages",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SenderName",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAt",
                table: "Announcements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPinned",
                table: "Announcements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "Announcements",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastMessageContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastMessageAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConversationParticipants",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ConversationId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserRole = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UnreadCount = table.Column<int>(type: "int", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConversationParticipants_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Resources_Level",
                table: "Resources",
                column: "Level");

            migrationBuilder.CreateIndex(
                name: "IX_Resources_TeacherProfileId",
                table: "Resources",
                column: "TeacherProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId_SentAt",
                table: "Messages",
                columns: new[] { "ConversationId", "SentAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ConversationParticipants_ConversationId_UserId",
                table: "ConversationParticipants",
                columns: new[] { "ConversationId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConversationParticipants_UserId",
                table: "ConversationParticipants",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_UpdatedAt",
                table: "Conversations",
                column: "UpdatedAt");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages",
                column: "ConversationId",
                principalTable: "Conversations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Conversations_ConversationId",
                table: "Messages");

            migrationBuilder.DropTable(
                name: "ConversationParticipants");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropIndex(
                name: "IX_Resources_Level",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Resources_TeacherProfileId",
                table: "Resources");

            migrationBuilder.DropIndex(
                name: "IX_Messages_ConversationId_SentAt",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "DownloadCount",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "FileSize",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "TeacherProfileId",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Resources");

            migrationBuilder.DropColumn(
                name: "ReadAt",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "SenderName",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "ExpiresAt",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "IsPinned",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "Announcements");

            migrationBuilder.RenameColumn(
                name: "ConversationId",
                table: "Messages",
                newName: "ReceiverId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages",
                newName: "IX_Messages_ReceiverId");

            migrationBuilder.RenameColumn(
                name: "SentAt",
                table: "Announcements",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "RecipientType",
                table: "Announcements",
                newName: "TargetAudience");

            migrationBuilder.RenameColumn(
                name: "RecipientId",
                table: "Announcements",
                newName: "TargetStudentIdsJson");

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "Resources",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Level",
                table: "Resources",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "ExamType",
                table: "Resources",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UploadedBy",
                table: "Resources",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Resources",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Year",
                table: "Resources",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AttachmentUrl",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "Messages",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Resources_ExamType",
                table: "Resources",
                column: "ExamType");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReceiverId_IsRead",
                table: "Messages",
                columns: new[] { "ReceiverId", "IsRead" });
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ClassBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentMetadataToFeeTransactions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaymentMetadataJson",
                table: "FeeTransactions",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentMetadataJson",
                table: "FeeTransactions");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wallee.Mall.Migrations
{
    /// <inheritdoc />
    public partial class ModProduct2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SkuSnapshot",
                table: "AppProducts");

            migrationBuilder.AddColumn<decimal>(
                name: "DefaultJdPrice",
                table: "AppProducts",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DefaultJdSkuId",
                table: "AppProducts",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DefaultOriginalPrice",
                table: "AppProducts",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DefaultPrice",
                table: "AppProducts",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DefaultJdPrice",
                table: "AppProducts");

            migrationBuilder.DropColumn(
                name: "DefaultJdSkuId",
                table: "AppProducts");

            migrationBuilder.DropColumn(
                name: "DefaultOriginalPrice",
                table: "AppProducts");

            migrationBuilder.DropColumn(
                name: "DefaultPrice",
                table: "AppProducts");

            migrationBuilder.AddColumn<string>(
                name: "SkuSnapshot",
                table: "AppProducts",
                type: "jsonb",
                nullable: true);
        }
    }
}

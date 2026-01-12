using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wallee.Mall.Migrations
{
    /// <inheritdoc />
    public partial class ModProduct3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppProductSkus_Attributes",
                table: "AppProductSkus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AppProductSkus_Attributes",
                table: "AppProductSkus",
                column: "Attributes")
                .Annotation("Npgsql:IndexMethod", "gin");
        }
    }
}

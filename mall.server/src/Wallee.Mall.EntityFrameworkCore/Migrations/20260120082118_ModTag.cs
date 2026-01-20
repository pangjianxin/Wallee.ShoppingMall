using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wallee.Mall.Migrations
{
    /// <inheritdoc />
    public partial class ModTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppProductTags_AppProducts_ProductId",
                table: "AppProductTags");

            migrationBuilder.DropIndex(
                name: "IX_AppProductTags_NormalizedTagName",
                table: "AppProductTags");

            migrationBuilder.DropColumn(
                name: "NormalizedTagName",
                table: "AppProductTags");

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "AppProductTags",
                type: "character varying(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExtraProperties",
                table: "AppProductTags",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "AppProductTags");

            migrationBuilder.DropColumn(
                name: "ExtraProperties",
                table: "AppProductTags");

            migrationBuilder.AddColumn<string>(
                name: "NormalizedTagName",
                table: "AppProductTags",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_AppProductTags_NormalizedTagName",
                table: "AppProductTags",
                column: "NormalizedTagName");

            migrationBuilder.AddForeignKey(
                name: "FK_AppProductTags_AppProducts_ProductId",
                table: "AppProductTags",
                column: "ProductId",
                principalTable: "AppProducts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

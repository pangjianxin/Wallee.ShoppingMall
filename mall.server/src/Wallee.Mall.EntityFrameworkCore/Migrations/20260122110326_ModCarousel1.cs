using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wallee.Mall.Migrations
{
    /// <inheritdoc />
    public partial class ModCarousel1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Link",
                table: "AppCarousels");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "AppCarousels",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "AppCarousels");

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "AppCarousels",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: false,
                defaultValue: "");
        }
    }
}

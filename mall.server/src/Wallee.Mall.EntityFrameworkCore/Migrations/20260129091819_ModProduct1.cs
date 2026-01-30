using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wallee.Mall.Migrations
{
    /// <inheritdoc />
    public partial class ModProduct1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "AppProductSkus");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "AppProducts");

            migrationBuilder.DropColumn(
                name: "DiscountRate",
                table: "AppProducts");

            migrationBuilder.DropColumn(
                name: "JdPrice",
                table: "AppProducts");

            migrationBuilder.DropColumn(
                name: "OriginalPrice",
                table: "AppProducts");

            migrationBuilder.RenameColumn(
                name: "SkuCode",
                table: "AppProductSkus",
                newName: "JdSkuId");

            migrationBuilder.RenameColumn(
                name: "DiscountRate",
                table: "AppProductSkus",
                newName: "Price");

            migrationBuilder.RenameIndex(
                name: "IX_AppProductSkus_ProductId_SkuCode",
                table: "AppProductSkus",
                newName: "IX_AppProductSkus_ProductId_JdSkuId");

            migrationBuilder.AddColumn<string>(
                name: "AttributesSignature",
                table: "AppProductSkus",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SkuSnapshot",
                table: "AppProducts",
                type: "jsonb",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProductSkus_ProductId_AttributesSignature",
                table: "AppProductSkus",
                columns: new[] { "ProductId", "AttributesSignature" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppProductSkus_ProductId_AttributesSignature",
                table: "AppProductSkus");

            migrationBuilder.DropColumn(
                name: "AttributesSignature",
                table: "AppProductSkus");

            migrationBuilder.DropColumn(
                name: "SkuSnapshot",
                table: "AppProducts");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "AppProductSkus",
                newName: "DiscountRate");

            migrationBuilder.RenameColumn(
                name: "JdSkuId",
                table: "AppProductSkus",
                newName: "SkuCode");

            migrationBuilder.RenameIndex(
                name: "IX_AppProductSkus_ProductId_JdSkuId",
                table: "AppProductSkus",
                newName: "IX_AppProductSkus_ProductId_SkuCode");

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "AppProductSkus",
                type: "character varying(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "AppProducts",
                type: "character varying(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountRate",
                table: "AppProducts",
                type: "numeric(18,4)",
                nullable: false,
                defaultValue: 1m);

            migrationBuilder.AddColumn<decimal>(
                name: "JdPrice",
                table: "AppProducts",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OriginalPrice",
                table: "AppProducts",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Wallee.Mall.Migrations
{
    /// <inheritdoc />
    public partial class InitProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppCarousels",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    CoverImageMediaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Priority = table.Column<long>(type: "bigint", nullable: false),
                    Link = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppCarousels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppMallMedias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Name = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false, comment: "媒体文件名称"),
                    MimeType = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false, comment: "媒体文件类型"),
                    Size = table.Column<long>(type: "bigint", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMallMedias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppProducts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Brand = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    ShortDescription = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    OriginalPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    DiscountRate = table.Column<decimal>(type: "numeric(18,4)", nullable: false, defaultValue: 1m),
                    JdPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Currency = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    SalesCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    ProductCovers = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppProducts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppTags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    NormalizedName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppProductSkus",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    SkuCode = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    OriginalPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    DiscountRate = table.Column<decimal>(type: "numeric(18,4)", nullable: false, defaultValue: 1m),
                    JdPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    Currency = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    StockQuantity = table.Column<int>(type: "integer", nullable: false),
                    Attributes = table.Column<Dictionary<string, string>>(type: "jsonb", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppProductSkus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppProductSkus_AppProducts_ProductId",
                        column: x => x.ProductId,
                        principalTable: "AppProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppProductTags",
                columns: table => new
                {
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false),
                    NormalizedTagName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppProductTags", x => new { x.ProductId, x.TagId });
                    table.ForeignKey(
                        name: "FK_AppProductTags_AppProducts_ProductId",
                        column: x => x.ProductId,
                        principalTable: "AppProducts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppProducts_Brand",
                table: "AppProducts",
                column: "Brand");

            migrationBuilder.CreateIndex(
                name: "IX_AppProducts_CreationTime",
                table: "AppProducts",
                column: "CreationTime");

            migrationBuilder.CreateIndex(
                name: "IX_AppProducts_IsActive",
                table: "AppProducts",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_AppProducts_IsActive_SortOrder_SalesCount",
                table: "AppProducts",
                columns: new[] { "IsActive", "SortOrder", "SalesCount" });

            migrationBuilder.CreateIndex(
                name: "IX_AppProducts_Name",
                table: "AppProducts",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_AppProductSkus_Attributes",
                table: "AppProductSkus",
                column: "Attributes")
                .Annotation("Npgsql:IndexMethod", "gin");

            migrationBuilder.CreateIndex(
                name: "IX_AppProductSkus_ProductId_SkuCode",
                table: "AppProductSkus",
                columns: new[] { "ProductId", "SkuCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProductTags_NormalizedTagName",
                table: "AppProductTags",
                column: "NormalizedTagName");

            migrationBuilder.CreateIndex(
                name: "IX_AppProductTags_ProductId",
                table: "AppProductTags",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_AppProductTags_TagId",
                table: "AppProductTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTags_NormalizedName",
                table: "AppTags",
                column: "NormalizedName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppCarousels");

            migrationBuilder.DropTable(
                name: "AppMallMedias");

            migrationBuilder.DropTable(
                name: "AppProductSkus");

            migrationBuilder.DropTable(
                name: "AppProductTags");

            migrationBuilder.DropTable(
                name: "AppTags");

            migrationBuilder.DropTable(
                name: "AppProducts");
        }
    }
}

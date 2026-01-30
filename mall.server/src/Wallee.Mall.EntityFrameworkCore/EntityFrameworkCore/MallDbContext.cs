using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.BlobStoring.Database.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using Wallee.Mall.Carousels;
using Wallee.Mall.Carts;
using Wallee.Mall.Cms;
using Wallee.Mall.Medias;
using Wallee.Mall.Products;
using Wallee.Mall.Tags;

namespace Wallee.Mall.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class MallDbContext(DbContextOptions<MallDbContext> options) :
    AbpDbContext<MallDbContext>(options),
    ITenantManagementDbContext,
    IIdentityDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */


    #region Entities from the modules

    /* Notice: We only implemented IIdentityProDbContext and ISaasDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityProDbContext and ISaasDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    // Identity
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }
    public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
    public DbSet<IdentitySession> Sessions { get; set; }

    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    #endregion
    public DbSet<Product> Products { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<ProductTag> ProductTags { get; set; }
    public DbSet<ProductSku> ProductSkus { get; set; }
    public DbSet<Carousel> Carousels { get; set; }
    public DbSet<MallMedia> MallMedias { get; set; }
    public DbSet<Post> Posts { get; set; }

    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */

        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureFeatureManagement();
        builder.ConfigureIdentity();
        builder.ConfigureOpenIddict();
        builder.ConfigureTenantManagement();
        builder.ConfigureBlobStoring();

        /* Configure your own tables/entities inside here */

        builder.Entity<Product>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "Products", MallConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(p => p.Name).IsRequired().HasMaxLength(256);
            b.Property(p => p.Brand).HasMaxLength(128);
            b.Property(p => p.ShortDescription).HasMaxLength(1024);
            b.Property(p => p.IsActive).HasDefaultValue(true);
            b.Property(p => p.SortOrder).HasDefaultValue(0);
            b.Property(p => p.SalesCount).HasDefaultValue(0);

            b.HasMany(p => p.Skus).WithOne().HasForeignKey(s => s.ProductId);
            b.HasIndex(p => p.Name);
            b.HasIndex(p => p.Brand);
            b.HasIndex(p => p.IsActive);
            b.HasIndex(p => new { p.IsActive, p.SortOrder, p.SalesCount });
            b.HasIndex(p => p.CreationTime);

            b.OwnsMany(p => p.ProductCovers, pc =>
            {
                pc.ToJson();
            });

            b.OwnsOne(it => it.SkuSnapshot, config =>
            {
                config.ToJson();
                config.Property(p => p.OriginalPrice).HasColumnType("decimal(18,2)");
                config.Property(p => p.Price).HasColumnType("decimal(18,4)");
                config.Property(p => p.JdPrice).HasColumnType("decimal(18,2)");
            });


        });

        builder.Entity<ProductSku>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "ProductSkus", MallConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(s => s.JdSkuId).IsRequired().HasMaxLength(64);
            b.Property(s => s.OriginalPrice).HasColumnType("decimal(18,2)");
            b.Property(s => s.Price).HasColumnType("decimal(18,4)").HasDefaultValue(1m);
            b.Property(s => s.JdPrice).HasColumnType("decimal(18,2)");
            b.Property(s => s.AttributesSignature).IsRequired().HasMaxLength(2048);
            b.HasIndex(s => new { s.ProductId, s.JdSkuId }).IsUnique();
            b.HasIndex(s => new { s.ProductId, s.AttributesSignature }).IsUnique();
            b.OwnsMany(s => s.Attributes, a =>
            {
                a.ToJson();
                a.Property(x => x.Key).HasMaxLength(128);
                a.Property(x => x.Value).HasMaxLength(1024);
            });

            b.Ignore(it => it.DiscountText);
        });

        builder.Entity<Tag>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "Tags", MallConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(t => t.Name).IsRequired().HasMaxLength(128);
            b.Property(t => t.NormalizedName).IsRequired().HasMaxLength(128);
            b.HasIndex(t => t.NormalizedName).IsUnique();
        });

        builder.Entity<ProductTag>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "ProductTags", MallConsts.DbSchema);
            b.ConfigureByConvention();
            b.HasKey(pt => new { pt.ProductId, pt.TagId });
            b.HasIndex(pt => pt.TagId);
            b.HasIndex(pt => pt.ProductId);

        });

        builder.Entity<MallMedia>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "MallMedias", MallConsts.DbSchema);
            b.ConfigureByConvention();

            b.Property(it => it.Name).IsRequired().HasMaxLength(1024).HasComment("媒体文件名称");
            b.Property(it => it.MimeType).IsRequired().HasMaxLength(512).HasComment("媒体文件类型");
        });

        builder.Entity<Carousel>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "Carousels", MallConsts.DbSchema);
            b.ConfigureByConvention();

            b.Property(it => it.Title).IsRequired().HasMaxLength(256);
            b.Property(it => it.Description).IsRequired(false).HasMaxLength(2048);
            b.Property(it => it.Content).IsRequired().HasMaxLength(int.MaxValue);
        });

        builder.Entity<Post>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "Posts", MallConsts.DbSchema);
            b.ConfigureByConvention();
            b.OwnsOne(it => it.ProductInfo, config =>
            {
                config.ToJson();
            });
            b.Property(it => it.Content).HasMaxLength(int.MaxValue).IsRequired();
        });

        builder.Entity<Cart>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "Carts", MallConsts.DbSchema);
            b.ConfigureByConvention();

            b.HasMany(x => x.Items)
                .WithOne()
                .HasForeignKey(x => x.CartId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<CartItem>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "CartItems", MallConsts.DbSchema);
            b.ConfigureByConvention();

            b.Property(x => x.Quantity).IsRequired();
            b.HasIndex(x => x.CartId);
            b.HasIndex(x => new { x.CartId, x.SkuId }).IsUnique();
        });
    }
}

using Microsoft.EntityFrameworkCore;
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
using Wallee.Mall.Products;
using Wallee.Mall.Tags;

namespace Wallee.Mall.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class MallDbContext :
    AbpDbContext<MallDbContext>,
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

    public MallDbContext(DbContextOptions<MallDbContext> options)
        : base(options)
    {

    }

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
            b.Property(p => p.OriginalPrice).HasColumnType("decimal(18,2)");
            b.Property(p => p.DiscountPrice).HasColumnType("decimal(18,2)");
            b.Property(p => p.JdPrice).HasColumnType("decimal(18,2)");
            b.Property(p => p.Currency).IsRequired().HasMaxLength(8);

            b.HasMany(p => p.Skus)
                .WithOne(s => s.Product)
                .HasForeignKey(s => s.ProductId)
                .IsRequired();

            b.HasMany(p => p.ProductTags)
                .WithOne(pt => pt.Product)
                .HasForeignKey(pt => pt.ProductId)
                .IsRequired();

            b.HasIndex(p => p.Name);
            b.HasIndex(p => p.Brand);
        });

        builder.Entity<ProductSku>(b =>
        {
            b.ToTable(MallConsts.DbTablePrefix + "ProductSkus", MallConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(s => s.SkuCode).IsRequired().HasMaxLength(64);
            b.Property(s => s.OriginalPrice).HasColumnType("decimal(18,2)");
            b.Property(s => s.DiscountPrice).HasColumnType("decimal(18,2)");
            b.Property(s => s.JdPrice).HasColumnType("decimal(18,2)");
            b.Property(s => s.Currency).IsRequired().HasMaxLength(8);
            b.Property(s => s.Attributes).HasColumnType("jsonb");

            b.HasIndex(s => new { s.ProductId, s.SkuCode }).IsUnique();
            // 为属性查询（颜色/尺码等）建立 GIN 索引，配合 jsonb 查询
            b.HasIndex(s => s.Attributes).HasMethod("gin");
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
            b.HasOne(pt => pt.Product)
                .WithMany(p => p.ProductTags)
                .HasForeignKey(pt => pt.ProductId)
                .IsRequired();
            b.HasOne(pt => pt.Tag)
                .WithMany()
                .HasForeignKey(pt => pt.TagId)
                .IsRequired();

            b.HasIndex(pt => pt.TagId);
            b.HasIndex(pt => pt.ProductId);
        });
    }
}

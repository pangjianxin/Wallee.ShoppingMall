using Riok.Mapperly.Abstractions;
using Volo.Abp.AuditLogging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Mapperly;
using Wallee.Mall.AuditLogs.Dtos;
using Wallee.Mall.BackgroundJobs.Dtos;
using Wallee.Mall.Cms;
using Wallee.Mall.Cms.Dtos;
using Wallee.Mall.Medias;
using Wallee.Mall.Medias.Dtos;
using Wallee.Mall.Medias.Etos;
using Wallee.Mall.Products;
using Wallee.Mall.Products.Dtos;
using Wallee.Mall.Tags;
using Wallee.Mall.Tags.Dtos;

namespace Wallee.Mall;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class AuditLogMappers : MapperBase<AuditLog, AuditLogDto>
{
    public override partial AuditLogDto Map(AuditLog source);
    public override partial void Map(AuditLog source, AuditLogDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class AduitLogActionMappers : MapperBase<AuditLogAction, AuditLogActionDto>
{
    public override partial AuditLogActionDto Map(AuditLogAction source);
    public override partial void Map(AuditLogAction source, AuditLogActionDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class BackgroundJobMappers : MapperBase<BackgroundJobRecord, BackgroundJobRecordDto>
{
    public override partial BackgroundJobRecordDto Map(BackgroundJobRecord source);
    public override partial void Map(BackgroundJobRecord source, BackgroundJobRecordDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class TagMappers : MapperBase<Tag, TagDto>
{
    public override partial TagDto Map(Tag source);
    public override partial void Map(Tag source, TagDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class MallMediaMappers : MapperBase<MallMedia, MallMediaDto>
{
    public override partial MallMediaDto Map(MallMedia source);
    public override partial void Map(MallMedia source, MallMediaDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class MallMediaEtoMappers : MapperBase<MallMedia, MallMediaEto>
{
    public override partial MallMediaEto Map(MallMedia source);
    public override partial void Map(MallMedia source, MallMediaEto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class ProductMappers : MapperBase<Product, ProductDto>
{
    public override partial ProductDto Map(Product source);
    public override partial void Map(Product source, ProductDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class PopularTagMappers : MapperBase<PopularTag, PopularTagDto>
{
    public override partial PopularTagDto Map(PopularTag source);
    public override partial void Map(PopularTag source, PopularTagDto destination);
}

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class ProductPostMappers : MapperBase<ProductPost, ProductPostDto>
{
    public override partial ProductPostDto Map(ProductPost source);
    public override partial void Map(ProductPost source, ProductPostDto destination);
}



using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products
{
    public interface IProductAppService : ICrudAppService<ProductDto, Guid, ProductGetListInput, CreateProductDto, UpdateProductDto>
    {
        Task<List<ProductSkuDto>> GetSkusAsync(Guid productId);
        Task<List<ProductSkuDto>> UpsertSkusAsync(Guid productId, UpsertProductSkusDto input);
        Task DeleteSkuAsync(Guid productId, Guid skuId);
    }
}

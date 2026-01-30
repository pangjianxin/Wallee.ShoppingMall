using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products
{
    public interface IProductAppService : ICrudAppService<ProductDto, Guid, ProductGetListInput, CreateProductDto, UpdateProductDto>
    {
        Task FetchSkusWithOneBoundAsync(Guid id, FetchSkuWithOneBoundDto input);
        Task<List<ProductSkuDto>> GetSkusAsync(Guid productId);
        Task<ProductDto> UpdateProductCovers(Guid id, UpdateProductCoversDto input);
        Task<ProductDto> UpdateSkusAsync(Guid productId, UpsertProductSkusDto input);
    }
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products
{
    public interface IProductAppService : ICrudAppService<ProductDto, Guid, ProductGetListInput, CreateProductDto, UpdateProductDto>
    {
        Task CreateByJdSkuAsync(CreateProductByJdSkuDto input);
        Task<List<ProductSkuDto>> GetSkusAsync(Guid productId);
        Task<ProductDto> UpdateCoversAsync(Guid id, UpdateProductCoversDto input);
        Task<ProductDto> UpdateSkusAsync(Guid productId, UpdateProductSkusDto input);
    }
}

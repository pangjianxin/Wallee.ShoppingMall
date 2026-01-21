using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Cms.Dtos;

namespace Wallee.Mall.Cms
{
    public interface IProductPostAppService : IReadOnlyAppService<ProductPostDto, Guid, ProductPostGetListInput>
    {
        Task<ProductPostDto> CreateAsync(CreateProductPostDto input);
        Task DeleteAsync(Guid id);
        Task<List<ProductPostDto>> GetListByProductAsync(Guid productId);
        Task<ProductPostDto> UpdateAsync(Guid id, UpdateProductPostDto input);
    }
}

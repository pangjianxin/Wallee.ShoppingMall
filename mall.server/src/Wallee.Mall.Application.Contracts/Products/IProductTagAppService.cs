using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products
{
    public interface IProductTagAppService : IApplicationService
    {
        Task AddTagToProductAsync(CreateProductTagDto input);

        Task RemoveTagFromProductAsync(RemoveProductTagDto input);

        Task SetProductTagsAsync(SetProductTagDto input);
    }
}

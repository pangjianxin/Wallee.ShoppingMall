using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Wallee.Mall.Products.Dtos;
using Wallee.Mall.Tags;

namespace Wallee.Mall.Products
{
    public class ProductTagAppService(
        TagManager tagManager,
        ProductTagManager productTagManager) : IProductTagAppService, ITransientDependency
    {
        public virtual async Task AddTagToProductAsync(CreateProductTagDto input)
        {
            var tag = await tagManager.GetOrAddAsync(input.TagName);

            await productTagManager.AddTagToProductAsync(tag.Id, input.ProductId);
        }
        public virtual async Task RemoveTagFromProductAsync(RemoveProductTagDto input)
        {
            await productTagManager.RemoveTagFromProductAsync(input.TagId, input.ProductId);
        }
        public virtual async Task SetProductTagsAsync(SetProductTagDto input)
        {
            await productTagManager.SetProductTagsAsync(input.ProductId, input.Tags);
        }
    }
}

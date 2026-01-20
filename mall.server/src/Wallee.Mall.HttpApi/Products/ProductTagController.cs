using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Wallee.Mall.Products.Dtos;

namespace Wallee.Mall.Products
{
    [Route("/api/mall/product-tags")]
    public class ProductTagController(IProductTagAppService service) : MallController, IProductTagAppService
    {
        [HttpPut]
        [Route("add-tag")]
        public async Task AddTagToProductAsync(CreateProductTagDto input)
        {
            await service.AddTagToProductAsync(input);
        }

        [HttpPut]
        [Route("remove-tag")]
        public async Task RemoveTagFromProductAsync(RemoveProductTagDto input)
        {
            await service.RemoveTagFromProductAsync(input);
        }

        [HttpPut]
        [Route("set-tags")]
        public async Task SetProductTagsAsync(SetProductTagDto input)
        {
            await service.SetProductTagsAsync(input);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Wallee.Mall.Carts.Dtos;

namespace Wallee.Mall.Carts
{
    [Route("/api/mall/carts")]
    public class CartController(ICartAppService service) : MallController, ICartAppService
    {
        [HttpPut]
        [Route("items/add")]
        public async Task AddItemAsync(AddCartItemDto input)
        {
            await service.AddItemAsync(input);
        }

        [HttpPut]
        [Route("items/clear")]
        public async Task ClearAsync()
        {
            await service.ClearAsync();
        }

        [HttpGet]
        [Route("")]
        public async Task<CartDto> GetAsync()
        {
            return await service.GetAsync();
        }

        [HttpPut]
        [Route("items/remove")]
        public async Task<CartDto> RemoveItemAsync(CartRemoveItemDto input)
        {
            return await service.RemoveItemAsync(input);
        }

        [HttpPut]
        [Route("items/set-select-all")]
        public async Task<CartDto> SelectAllAsync(CartSelectAllDto input)
        {
            return await service.SelectAllAsync(input);
        }

        [HttpPut]
        [Route("items/set-select")]
        public async Task<CartDto> SetItemSelectedAsync(UpdateCartItemSelectionDto input)
        {
            return await service.SetItemSelectedAsync(input);
        }

        [HttpPut]
        [Route("items/update-quantity")]
        public async Task<CartDto> UpdateQuantityAsync(UpdateCartItemQuantityDto input)
        {
            return await service.UpdateQuantityAsync(input);
        }
    }
}

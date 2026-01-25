using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Carts.Dtos;

namespace Wallee.Mall.Carts;

public interface ICartAppService : IApplicationService
{
    Task<CartDto> GetAsync();

    Task AddItemAsync(AddCartItemDto input);
    Task<CartDto> RemoveItemAsync(CartRemoveItemDto input);
    Task<CartDto> UpdateQuantityAsync(UpdateCartItemQuantityDto input);

    Task<CartDto> SetItemSelectedAsync(UpdateCartItemSelectionDto input);

    Task<CartDto> SelectAllAsync(CartSelectAllDto input);

    Task ClearAsync();
}

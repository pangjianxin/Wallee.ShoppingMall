using Microsoft.AspNetCore.Authorization;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Users;
using Wallee.Mall.Carts.Dtos;
using Wallee.Mall.Products;

namespace Wallee.Mall.Carts;

[Authorize]
public class CartAppService(
    ICartRepository cartRepository,
    IProductRepository productRepository) : ApplicationService, ICartAppService
{
    public async Task<CartDto> GetAsync()
    {
        var userId = CurrentUser.GetId();
        var cart = await GetOrCreateCartAsync(userId);
        return await MapToDtoAsync(cart);
    }


    public async Task AddItemAsync(AddCartItemDto input)
    {
        var userId = CurrentUser.GetId();
        var cart = await GetOrCreateCartAsync(userId);

        cart.AddItem(input.SkuId, input.Quantity);

        await cartRepository.UpdateAsync(cart, autoSave: true);
    }


    public async Task<CartDto> UpdateQuantityAsync(UpdateCartItemQuantityDto input)
    {
        var userId = CurrentUser.GetId();
        var cart = await GetOrCreateCartAsync(userId);

        cart.UpdateQuantity(input.ItemId, input.Quantity);

        await cartRepository.UpdateAsync(cart, autoSave: true);

        return await MapToDtoAsync(cart);
    }


    public async Task<CartDto> RemoveItemAsync(CartRemoveItemDto input)
    {
        var userId = CurrentUser.GetId();
        var cart = await GetOrCreateCartAsync(userId);
        cart.RemoveItem(input.ItemId);

        await cartRepository.UpdateAsync(cart, autoSave: true);

        return await MapToDtoAsync(cart);
    }


    public async Task<CartDto> SetItemSelectedAsync(UpdateCartItemSelectionDto input)
    {
        var userId = CurrentUser.GetId();
        var cart = await GetOrCreateCartAsync(userId);
        cart.SetItemSelected(input.ItemId, input.IsSelected);

        await cartRepository.UpdateAsync(cart, autoSave: true);

        return await MapToDtoAsync(cart);
    }


    public async Task<CartDto> SelectAllAsync(CartSelectAllDto input)
    {
        var userId = CurrentUser.GetId();
        var cart = await GetOrCreateCartAsync(userId);

        cart.SelectAll(input.IsSelected);

        await cartRepository.UpdateAsync(cart, autoSave: true);

        return await MapToDtoAsync(cart);
    }


    public async Task ClearAsync()
    {
        var userId = CurrentUser.GetId();
        var cart = await GetOrCreateCartAsync(userId);
        cart.Clear();
        await cartRepository.UpdateAsync(cart, autoSave: true);
    }

    private async Task<Cart> GetOrCreateCartAsync(Guid userId)
    {
        var cart = await cartRepository.FindAsync(it => it.CreatorId == userId);
        if (cart is not null)
        {
            return cart;
        }

        cart = new Cart(GuidGenerator.Create());

        await cartRepository.InsertAsync(cart, autoSave: true);
        return cart;
    }

    private async Task<CartDto> MapToDtoAsync(Cart cart)
    {
        var dto = new CartDto
        {
            Id = cart.Id,
            CreationTime = cart.CreationTime,
            CreatorId = cart.CreatorId,
            LastModificationTime = cart.LastModificationTime,
            LastModifierId = cart.LastModifierId,
            Items = []
        };

        if (cart.Items.Count == 0)
        {
            return dto;
        }

        var skuIds = cart.Items.Select(x => x.SkuId).Distinct().ToList();

        var products = await productRepository.GetQueryableWithNoTrackingAsync();

        var skuInfosQuery = products.SelectMany(p => p.Skus!.Select(s => new
            {
                ProductId = p.Id,
                ProductName = p.Name,
                ProductCoverIds = p.ProductCovers.Select(c => c.MallMediaId).ToList(),
                SkuId = s.Id,
                SkuOriginalPrice = s.OriginalPrice,
                SkuDiscountRate = s.Price,
                SkuJdPrice = s.JdPrice,
                SkuStockQuantity = s.StockQuantity,
            }))
            .Where(x => skuIds.Contains(x.SkuId));

        var skuInfos = await AsyncExecuter.ToListAsync(skuInfosQuery);

        foreach (var item in cart.Items.OrderByDescending(x => x.CreationTime))
        {
            var sku = skuInfos.FirstOrDefault(x => x.SkuId == item.SkuId);
            if (sku is null)
            {
                continue;
            }

            var price = sku.SkuJdPrice ?? (sku.SkuOriginalPrice * sku.SkuDiscountRate);

            dto.Items.Add(new CartItemDto
            {
                Id = item.Id,
                CreationTime = item.CreationTime,
                CreatorId = item.CreatorId,
                LastModificationTime = item.LastModificationTime,
                LastModifierId = item.LastModifierId,

                SkuId = item.SkuId,
                Quantity = item.Quantity,
                IsSelected = item.IsSelected,
                ProductId = sku.ProductId,
                ProductName = sku.ProductName,
                ProductCovers = [.. sku.ProductCoverIds],
                Price = price,
                StockQuantity = sku.SkuStockQuantity
            });
        }

        return dto;
    }
}

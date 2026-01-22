using System;

namespace Wallee.Mall.Carts.Dtos;

public class AddCartItemDto
{
    public Guid SkuId { get; set; }
    public int Quantity { get; set; } = 1;
}

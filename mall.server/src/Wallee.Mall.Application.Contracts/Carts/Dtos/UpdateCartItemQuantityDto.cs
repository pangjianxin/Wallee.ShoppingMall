using System;

namespace Wallee.Mall.Carts.Dtos;

public class UpdateCartItemQuantityDto
{
    public Guid ItemId { get; set; }
    public int Quantity { get; set; }
}

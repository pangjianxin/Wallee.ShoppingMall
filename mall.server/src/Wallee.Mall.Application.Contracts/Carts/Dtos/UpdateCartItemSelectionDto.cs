using System;

namespace Wallee.Mall.Carts.Dtos;

public class UpdateCartItemSelectionDto
{
    public Guid ItemId { get; set; }
    public bool IsSelected { get; set; }
}

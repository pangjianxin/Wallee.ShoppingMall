using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Carts.Dtos;

public class CartItemDto : AuditedEntityDto<Guid>
{
    public Guid SkuId { get; set; }

    public int Quantity { get; set; }

    public bool IsSelected { get; set; }

    public Guid ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public List<Guid>? ProductCovers { get; set; }
}

using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Carts.Dtos;

public class CartDto : AuditedEntityDto<Guid>
{
    public List<CartItemDto> Items { get; set; } = [];
}

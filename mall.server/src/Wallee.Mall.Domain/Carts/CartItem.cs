using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Carts;

public class CartItem : AuditedEntity<Guid>
{
    public Guid CartId { get; protected set; }
    public Guid SkuId { get; protected set; }
    public int Quantity { get; protected set; }
    public bool IsSelected { get; protected set; } = true;

    protected CartItem()
    {
    }

    public CartItem(Guid cartId, Guid skuId, int quantity)
    {
        CartId = cartId;
        SkuId = skuId;
        SetQuantity(quantity);
    }

    public void Increase(int quantity)
    {
        if (quantity <= 0)
        {
            throw new UserFriendlyException("Quantity must be greater than 0.");
        }

        SetQuantity(Quantity + quantity);
    }

    public void SetQuantity(int quantity)
    {
        if (quantity <= 0)
        {
            throw new UserFriendlyException("Quantity must be greater than 0.");
        }

        Quantity = quantity;
    }

    public void SetSelected(bool isSelected)
    {
        IsSelected = isSelected;
    }
}

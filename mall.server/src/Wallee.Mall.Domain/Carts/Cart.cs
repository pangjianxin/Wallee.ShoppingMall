using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Wallee.Mall.Carts;

public class Cart : AuditedAggregateRoot<Guid>
{
    public ICollection<CartItem> Items { get; protected set; } = [];

    protected Cart()
    {
    }

    public Cart(Guid id) : base(id)
    {

    }

    public CartItem AddItem(Guid skuId, int quantity)
    {
        if (quantity <= 0)
        {
            throw new UserFriendlyException("Quantity must be greater than 0.");
        }

        var item = Items.FirstOrDefault(x => x.SkuId == skuId);
        if (item is null)
        {
            item = new CartItem(Id, skuId, quantity);
            Items.Add(item);
            return item;
        }

        item.Increase(quantity);
        return item;
    }

    public void UpdateQuantity(Guid itemId, int quantity)
    {
        var item = Items.FirstOrDefault(x => x.Id == itemId);
        if (item is null)
        {
            return;
        }

        if (quantity <= 0)
        {
            Items.Remove(item);
            return;
        }

        item.SetQuantity(quantity);
    }

    public void RemoveItem(Guid itemId)
    {
        var item = Items.FirstOrDefault(x => x.Id == itemId);
        if (item is null)
        {
            return;
        }

        Items.Remove(item);
    }

    public void SetItemSelected(Guid itemId, bool isSelected)
    {
        var item = Items.FirstOrDefault(x => x.Id == itemId);
        if (item is null)
        {
            return;
        }

        item.SetSelected(isSelected);
    }

    public void SelectAll(bool isSelected)
    {
        foreach (var item in Items)
        {
            item.SetSelected(isSelected);
        }
    }

    public void Clear()
    {
        Items.Clear();
    }
}

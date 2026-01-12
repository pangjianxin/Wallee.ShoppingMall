using System.Collections.Generic;

namespace Wallee.Mall.Products.Dtos
{
    public class UpsertProductSkusDto
    {
        public List<UpdateProductSkuDto> Items { get; set; } = [];
    }
}

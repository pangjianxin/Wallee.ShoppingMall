using System;

namespace Wallee.Mall.Products.Dtos
{
    public class ProductTagDto
    {
        public Guid ProductId { get;  set; }
        public Guid TagId { get;  set; }
        public string NormalizedTagName { get;  set; } = default!;
    }
}

using System;

namespace Wallee.Mall.Products.Dtos
{
    public class PopularTagDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}

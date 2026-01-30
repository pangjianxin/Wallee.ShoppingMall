

namespace Wallee.Mall.Products.Dtos
{
    public class CreateProductDto
    {
        public string Name { get; set; } = default!;
        public string? Brand { get; set; }
        public string? ShortDescription { get; set; }
        public int SortOrder { get; set; }
    }
}

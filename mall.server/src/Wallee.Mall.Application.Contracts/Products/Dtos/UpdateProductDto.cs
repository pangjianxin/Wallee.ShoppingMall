namespace Wallee.Mall.Products.Dtos
{
    public class UpdateProductDto
    {
        public string Name { get; set; } = default!;
        public string? Brand { get; set; }
        public string? ShortDescription { get; set; }
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; }
    }
}

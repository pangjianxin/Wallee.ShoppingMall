using AutoFilterer.Types;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Products.Dtos
{
    public class ProductGetListInput : FilterBase, IPagedAndSortedResultRequest
    {
        // [CompareTo(nameof(ProductDto.name))]
        public StringFilter? Name { get; set; }
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; }
        public string? Sorting { get; set; }
    }
}

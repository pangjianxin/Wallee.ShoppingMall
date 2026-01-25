using AutoFilterer.Types;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Cms.Dtos
{
    public class PostGetListInput : FilterBase, IPagedAndSortedResultRequest
    {
        public int SkipCount { get; set; }
        public int MaxResultCount { get; set; }
        public string? Sorting { get; set; }
    }
}

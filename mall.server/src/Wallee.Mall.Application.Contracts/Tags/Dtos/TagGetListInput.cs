using AutoFilterer.Attributes;
using AutoFilterer.Types;
using System;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Tags.Dtos;

[Serializable]
public class TagGetListInput : FilterBase, IPagedAndSortedResultRequest
{
    [CompareTo(nameof(TagDto.NormalizedName))]
    public StringFilter? NormalizedName { get; set; }
    public int SkipCount { get; set; }
    public int MaxResultCount { get; set; }
    public string? Sorting { get; set; }
}
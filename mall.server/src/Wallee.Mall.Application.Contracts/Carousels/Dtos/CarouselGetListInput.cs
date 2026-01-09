using AutoFilterer.Types;
using System;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Carousels.Dtos;

[Serializable]
public class CarouselGetListInput : FilterBase, IPagedAndSortedResultRequest
{
    public StringFilter? Title { get; set; }
    public int SkipCount { get; set; }
    public int MaxResultCount { get; set; }
    public string? Sorting { get; set; }
}
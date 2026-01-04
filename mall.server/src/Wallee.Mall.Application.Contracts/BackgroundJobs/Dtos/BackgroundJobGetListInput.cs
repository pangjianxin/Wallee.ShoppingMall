using AutoFilterer.Attributes;
using AutoFilterer.Enums;
using AutoFilterer.Types;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.BackgroundJobs.Dtos
{
	public class BackgroundJobGetListInput : FilterBase, IPagedAndSortedResultRequest
	{

		[CompareTo(nameof(BackgroundJobRecordDto.JobName))]
		[StringFilterOptions(StringFilterOption.Contains)]
		public string? Filter { get; set; }
		public int SkipCount { get; set; }
		public int MaxResultCount { get; set; }
		public string? Sorting { get; set; } = "creationTime desc";
	}
}

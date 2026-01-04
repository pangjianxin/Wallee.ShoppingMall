using AutoFilterer.Attributes;
using AutoFilterer.Types;
using Volo.Abp.Application.Dtos;

namespace Wallee.Mall.Medias.Dtos
{
	public class MallMediaGetListInput : FilterBase, IPagedAndSortedResultRequest
	{

		[CompareTo(nameof(MallMediaDto.Name))]
		public StringFilter? Name { get; set; }

		[CompareTo(nameof(MallMediaDto.MimeType))]
		public StringFilter? MimeType { get; set; }

		public int SkipCount { get; set; }
		public int MaxResultCount { get; set; }
		public string? Sorting { get; set; } = "creationTime desc";
	}
}

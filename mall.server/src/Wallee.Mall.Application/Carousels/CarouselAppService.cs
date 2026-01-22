using AutoFilterer.Extensions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Wallee.Mall.Carousels.Dtos;
using Wallee.Mall.Medias;

namespace Wallee.Mall.Carousels;


public class CarouselAppService : CrudAppService<Carousel, CarouselDto, Guid, CarouselGetListInput, CreateCarouselDto, UpdateCarouselDto>,
    ICarouselAppService
{
    private readonly IMallMediaAppService _mallMediaAppService;
    private readonly ICarouselRepository _repository;

    public CarouselAppService(
        IMallMediaAppService mallMediaAppService,
        ICarouselRepository repository) : base(repository)
    {
        _mallMediaAppService = mallMediaAppService;
        _repository = repository;
    }

    public override async Task<CarouselDto> CreateAsync(CreateCarouselDto input)
    {
        var entity = new Carousel(GuidGenerator.Create(), input.Title, input.Description, input.Content, input.CoverImageMediaId, input.Priority, input.Link);
        await Repository.InsertAsync(entity);
        return await MapToGetOutputDtoAsync(entity);
    }

    public override async Task<CarouselDto> UpdateAsync(Guid id, UpdateCarouselDto input)
    {
        var entity = await Repository.GetAsync(id);

        if (entity.CoverImageMediaId != input.CoverImageMediaId)
        {
            await _mallMediaAppService.DeleteAsync(entity.CoverImageMediaId);
        }

        entity.Update(input.Title, input.Description, input.Content, input.CoverImageMediaId, input.Priority, input.Link);

        await Repository.UpdateAsync(entity);

        return await MapToGetOutputDtoAsync(entity);
    }

    protected override async Task<IQueryable<Carousel>> CreateFilteredQueryAsync(CarouselGetListInput input)
    {
        return (await base.CreateFilteredQueryAsync(input)).ApplyFilter(input);
    }
}

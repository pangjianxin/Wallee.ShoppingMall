using System.Threading.Tasks;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events.Distributed;
using Volo.Abp.EventBus.Distributed;
using Volo.Abp.Uow;
using Wallee.Mall.Medias.BackgroundJobs;
using Wallee.Mall.Medias.Etos;

namespace Wallee.Mall.Medias.EventHandlers
{
    public class MallMediaEventHandler(IBackgroundJobManager backgroundJobManager)
        : IDistributedEventHandler<EntityCreatedEto<MallMediaEto>>,
        ITransientDependency
    {

        [UnitOfWork]
        public async Task HandleEventAsync(EntityCreatedEto<MallMediaEto> eventData)
        {
            await backgroundJobManager.EnqueueAsync(new MediaThumbnailsJobArgs
            {
                MediaId = eventData.Entity.Id,
                FileName = eventData.Entity.Name,
                MimeType = eventData.Entity.MimeType
            });
        }
    }
}

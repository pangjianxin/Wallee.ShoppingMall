using System.Threading.Tasks;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Uow;

namespace Wallee.Mall.Medias.BackgroundJobs
{
    public class BatchDeleteMediaJob(IMallMediaAppService mallMediaAppService) : AsyncBackgroundJob<BatchDeleteMediaJobArgs>, ITransientDependency
    {
        [UnitOfWork]
        public override async Task ExecuteAsync(BatchDeleteMediaJobArgs args)
        {
            foreach (var mediaId in args.MediaIds)
            {
                await mallMediaAppService.DeleteAsync(mediaId);
            }
        }
    }
}

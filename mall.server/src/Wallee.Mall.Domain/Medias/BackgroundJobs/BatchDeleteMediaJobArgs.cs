using System;
using System.Collections.Generic;
using System.Text;
using Volo.Abp.BackgroundJobs;

namespace Wallee.Mall.Medias.BackgroundJobs
{
    [BackgroundJobName("批量删除媒体文件")]
    public class BatchDeleteMediaJobArgs
    {
        public List<Guid> MediaIds { get; set; } = [];
    }
}

using System;
using System.ComponentModel.DataAnnotations;

namespace Wallee.Mall.BackgroundJobs.Dtos
{
    public class BackgroundJobPendingDto
    {
        [Required]
        public DateTime NextTryTime { get; set; }
    }
}

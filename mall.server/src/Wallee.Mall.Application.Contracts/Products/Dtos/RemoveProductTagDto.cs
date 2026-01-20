using System;
using System.ComponentModel.DataAnnotations;

namespace Wallee.Mall.Products.Dtos
{
    [Serializable]
    public class RemoveProductTagDto
    {
        [Required]
        public Guid TagId { get; set; }

        [Required]
        public Guid ProductId { get; set; }
    }
}

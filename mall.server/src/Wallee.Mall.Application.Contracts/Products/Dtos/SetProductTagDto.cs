using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Wallee.Mall.Products.Dtos
{
    public class SetProductTagDto
    {
        public Guid ProductId { get; set; }

        [Required]
        public List<string> Tags { get; set; } = [];
    }
}

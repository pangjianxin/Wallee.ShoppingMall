using System;
using System.ComponentModel.DataAnnotations;

namespace Wallee.Mall.Products.Dtos;

[Serializable]
public class CreateProductTagDto
{
    [Required]
    public string TagName { get; set; } = string.Empty;

    [Required]
    public Guid ProductId { get; set; }
}

using System;

namespace Wallee.Mall.Tags.Dtos;

[Serializable]
public class CreateTagDto
{
    public string Name { get; set; } = default!;
}
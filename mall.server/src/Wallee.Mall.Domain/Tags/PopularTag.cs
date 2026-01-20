using System;

namespace Wallee.Mall.Tags
{
    public class PopularTag(Guid id, string name, int count)
    {
        public Guid Id { get; set; } = id;
        public string Name { get; set; } = name;
        public int Count { get; set; } = count;
    }
}

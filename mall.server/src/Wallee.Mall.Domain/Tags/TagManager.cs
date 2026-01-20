using JetBrains.Annotations;
using System;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Services;

namespace Wallee.Mall.Tags
{
    public class TagManager(ITagRepository tagRepository) : DomainService
    {
        public virtual async Task<Tag> GetOrAddAsync([NotNull] string name)
        {
            var tag = await tagRepository.FindAsync(name);

            if (tag == null)
            {
                tag = await CreateAsync(GuidGenerator.Create(), name);
                await tagRepository.InsertAsync(tag);
            }

            return tag;
        }

        public virtual async Task<Tag> CreateAsync(Guid id, [NotNull] string name)
        {
            if (await tagRepository.AnyAsync(name))
            {
                throw new UserFriendlyException($"{name}已存在");
            }

            return new Tag(id, name);
        }

        public virtual async Task<Tag> UpdateAsync(Guid id, [NotNull] string name)
        {
            Check.NotNullOrEmpty(name, nameof(name));

            var tag = await tagRepository.GetAsync(id);

            if (name != tag.Name &&
                await tagRepository.AnyAsync(name))
            {
                throw new UserFriendlyException($"{name}已存在");
            }

            tag.SetName(name);

            return tag;
        }
    }
}

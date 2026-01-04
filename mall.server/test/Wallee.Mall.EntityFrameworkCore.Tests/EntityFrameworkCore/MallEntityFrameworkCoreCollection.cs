using Xunit;

namespace Wallee.Mall.EntityFrameworkCore;

[CollectionDefinition(MallTestConsts.CollectionDefinitionName)]
public class MallEntityFrameworkCoreCollection : ICollectionFixture<MallEntityFrameworkCoreFixture>
{

}

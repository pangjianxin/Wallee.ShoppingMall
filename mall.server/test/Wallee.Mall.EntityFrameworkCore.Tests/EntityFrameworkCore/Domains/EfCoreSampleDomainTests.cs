using Wallee.Mall.Samples;
using Xunit;

namespace Wallee.Mall.EntityFrameworkCore.Domains;

[Collection(MallTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<MallEntityFrameworkCoreTestModule>
{

}

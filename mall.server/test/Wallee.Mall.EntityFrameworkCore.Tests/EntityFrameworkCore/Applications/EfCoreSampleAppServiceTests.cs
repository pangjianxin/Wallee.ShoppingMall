using Wallee.Mall.Samples;
using Xunit;

namespace Wallee.Mall.EntityFrameworkCore.Applications;

[Collection(MallTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<MallEntityFrameworkCoreTestModule>
{

}

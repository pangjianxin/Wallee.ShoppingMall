using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Volo.Abp.Modularity;

namespace Wallee.Mall.Extensions
{
    public static class SwaggerConfigurationHelper
    {
        public static void ConfigureWithOidc(
            ServiceConfigurationContext context,
            string authority,
            string[] scopes,
            string apiTitle,
            string apiVersion = "v1",
            string apiName = "v1",
            string[]? flows = null,
            string? discoveryEndpoint = null
        )
        {
            context.Services.AddAbpSwaggerGenWithOidc(
                authority: authority,
                scopes: scopes,
                flows: flows,
                discoveryEndpoint: discoveryEndpoint,
                options =>
                {
                    options.SwaggerDoc(apiName, new OpenApiInfo { Title = apiTitle, Version = apiVersion });
                    options.DocInclusionPredicate((docName, description) => true);
                    options.SchemaFilter<SwaggerSchemaFilter>();
                    options.CustomSchemaIds(type =>
                    {
                        return $"{type.Namespace?.Replace(".", "")}{type.FriendlyId().Replace("[", "Of").Replace("]", "")}";
                    });
                    options.CustomOperationIds(options => $"{options.ActionDescriptor.RouteValues["controller"]}{options.ActionDescriptor.RouteValues["action"]}");
                });
        }
    }
}

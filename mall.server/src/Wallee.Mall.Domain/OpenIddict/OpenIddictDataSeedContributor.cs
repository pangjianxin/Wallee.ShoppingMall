using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using OpenIddict.Abstractions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.OpenIddict;
using Volo.Abp.OpenIddict.Applications;
using Volo.Abp.OpenIddict.Scopes;
using Volo.Abp.Uow;

namespace Wallee.Mall.OpenIddict;

/* Creates initial data that is needed to property run the application
 * and make client-to-server communication possible.
 */
public class OpenIddictDataSeedContributor(
    IConfiguration configuration,
    IOpenIddictApplicationRepository openIddictApplicationRepository,
    IAbpApplicationManager applicationManager,
    IOpenIddictScopeRepository openIddictScopeRepository,
    IOpenIddictScopeManager scopeManager) : OpenIddictDataSeedContributorBase(configuration, openIddictApplicationRepository, applicationManager, openIddictScopeRepository, scopeManager), IDataSeedContributor, ITransientDependency
{
    [UnitOfWork]
    public virtual async Task SeedAsync(DataSeedContext context)
    {
        await CreateScopesAsync();
        await CreateApplicationsAsync();
    }

    private async Task CreateScopesAsync()
    {
        await CreateScopesAsync(new OpenIddictScopeDescriptor 
        {
            Name = "Mall", 
            DisplayName = "Mall API", 
            Resources = { "Mall" }
        });
    }

    private async Task CreateApplicationsAsync()
    {
        var commonScopes = new List<string> {
            OpenIddictConstants.Permissions.Scopes.Address,
            OpenIddictConstants.Permissions.Scopes.Email,
            OpenIddictConstants.Permissions.Scopes.Phone,
            OpenIddictConstants.Permissions.Scopes.Profile,
            OpenIddictConstants.Permissions.Scopes.Roles,
            "Mall"
        };

        var configurationSection = Configuration.GetSection("OpenIddict:Applications");


        //Console Test / Angular Client
        var consoleAndAngularClientId = configurationSection["Mall_App:ClientId"];
        if (!consoleAndAngularClientId.IsNullOrWhiteSpace())
        {
            var consoleAndAngularClientRootUrl = configurationSection["Mall_App:RootUrl"]?.TrimEnd('/');
            await CreateOrUpdateApplicationAsync(
                applicationType: OpenIddictConstants.ApplicationTypes.Web,
                name: consoleAndAngularClientId!,
                type: OpenIddictConstants.ClientTypes.Public,
                consentType: OpenIddictConstants.ConsentTypes.Implicit,
                displayName: "Console Test / Angular Application",
                secret: null,
                grantTypes: [
                    OpenIddictConstants.GrantTypes.AuthorizationCode,
                    OpenIddictConstants.GrantTypes.Password,
                    OpenIddictConstants.GrantTypes.ClientCredentials,
                    OpenIddictConstants.GrantTypes.RefreshToken,
                    "LinkLogin",
                    "Impersonation"
                ],
                scopes: commonScopes,
                redirectUris: [consoleAndAngularClientRootUrl],
                postLogoutRedirectUris: [consoleAndAngularClientRootUrl],
                clientUri: consoleAndAngularClientRootUrl,
                logoUri: "/images/clients/angular.svg"
            );
        }

        
        




        // Swagger Client
        var swaggerClientId = configurationSection["Mall_Swagger:ClientId"];
        if (!swaggerClientId.IsNullOrWhiteSpace())
        {
            var swaggerRootUrl = configurationSection["Mall_Swagger:RootUrl"]?.TrimEnd('/');

            await CreateOrUpdateApplicationAsync(
                applicationType: OpenIddictConstants.ApplicationTypes.Web,
                name: swaggerClientId!,
                type: OpenIddictConstants.ClientTypes.Public,
                consentType: OpenIddictConstants.ConsentTypes.Implicit,
                displayName: "Swagger Application",
                secret: null,
                grantTypes: [OpenIddictConstants.GrantTypes.AuthorizationCode,],
                scopes: commonScopes,
                redirectUris: [$"{swaggerRootUrl}/swagger/oauth2-redirect.html"],
                clientUri: swaggerRootUrl?.EnsureEndsWith('/') + "swagger",
                logoUri: "/images/clients/swagger.svg"
            );
        }


    }
}

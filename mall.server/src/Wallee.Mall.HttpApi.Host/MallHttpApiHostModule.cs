using Microsoft.Agents.AI;
using Microsoft.Agents.AI.Hosting.AGUI.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using OpenIddict.Server.AspNetCore;
using OpenIddict.Validation.AspNetCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Account;
using Volo.Abp.Account.Web;
using Volo.Abp.AspNetCore.MultiTenancy;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.LeptonXLite.Bundling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.BlobStoring;
using Volo.Abp.BlobStoring.Minio;
using Volo.Abp.Modularity;
using Volo.Abp.OpenIddict;
using Volo.Abp.Security.Claims;
using Volo.Abp.Studio.Client.AspNetCore;
using Volo.Abp.Swashbuckle;
using Volo.Abp.UI.Navigation.Urls;
using Volo.Abp.VirtualFileSystem;
using Wallee.Mall.DbMigrations;
using Wallee.Mall.EntityFrameworkCore;
using Wallee.Mall.Extensions;
using Wallee.Mall.Medias;
using Wallee.Mall.MultiTenancy;

namespace Wallee.Mall;

[DependsOn(
    typeof(MallHttpApiModule),
    typeof(AbpStudioClientAspNetCoreModule),
    typeof(AbpAspNetCoreMvcUiLeptonXLiteThemeModule),
    typeof(AbpAutofacModule),
    typeof(AbpAspNetCoreMultiTenancyModule),
    typeof(MallApplicationModule),
    typeof(MallEntityFrameworkCoreModule),
    typeof(AbpAccountWebOpenIddictModule),
    typeof(AbpSwashbuckleModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpBlobStoringMinioModule)
    )]
public class MallHttpApiHostModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();
        var configuration = context.Services.GetConfiguration();

        PreConfigure<OpenIddictBuilder>(builder =>
        {
            builder.AddValidation(options =>
            {
                options.AddAudiences("Mall");
                options.UseLocalServer();
                options.UseAspNetCore();
            });
        });

        // 服务端安全与令牌生命周期
        PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
        {
            // 访问 / 身份令牌生命周期：1 周
            serverBuilder.SetAccessTokenLifetime(TimeSpan.FromDays(7));
            serverBuilder.SetIdentityTokenLifetime(TimeSpan.FromDays(7));
            // 刷新令牌生命周期：30 天（可按需调整）
            serverBuilder.SetRefreshTokenLifetime(TimeSpan.FromDays(30));
            // 强制使用 PKCE（授权码流安全增强）
            //serverBuilder.RequireProofKeyForCodeExchange();
            // 使用参考令牌（便于撤销 & 降低泄露风险）
            //serverBuilder.UseReferenceAccessTokens();
            //serverBuilder.UseReferenceRefreshTokens();
        });

        if (!hostingEnvironment.IsDevelopment())
        {
            PreConfigure<AbpOpenIddictAspNetCoreOptions>(options =>
            {
                options.AddDevelopmentEncryptionAndSigningCertificate = false;
            });

            PreConfigure<OpenIddictServerBuilder>(serverBuilder =>
            {
                serverBuilder.AddProductionEncryptionAndSigningCertificate("openiddict.pfx", configuration["AuthServer:CertificatePassPhrase"]!);
                serverBuilder.SetIssuer(new Uri(configuration["AuthServer:Authority"]!));
            });
        }
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();
        var hostingEnvironment = context.Services.GetHostingEnvironment();

        if (!configuration.GetValue<bool>("App:DisablePII"))
        {
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
            Microsoft.IdentityModel.Logging.IdentityModelEventSource.LogCompleteSecurityArtifact = true;
        }

        if (!configuration.GetValue<bool>("AuthServer:RequireHttpsMetadata"))
        {
            Configure<OpenIddictServerAspNetCoreOptions>(options =>
            {
                options.DisableTransportSecurityRequirement = true;
            });

            Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedProto;
                options.KnownIPNetworks.Clear();
                options.KnownProxies.Clear();
            });
        }

        ConfigureAuthentication(context);
        ConfigureUrls(configuration);
        ConfigureBundles();
        ConfigureConventionalControllers();
        ConfigureSwagger(context, configuration);
        ConfigureVirtualFileSystem(context);
        ConfigureCors(context, configuration);
        ConfigureMinio(configuration);
    }

    private static void ConfigureAuthentication(ServiceConfigurationContext context)
    {
        context.Services.ForwardIdentityAuthenticationForBearer(OpenIddictValidationAspNetCoreDefaults.AuthenticationScheme);
        context.Services.Configure<AbpClaimsPrincipalFactoryOptions>(options =>
        {
            options.IsDynamicClaimsEnabled = true;
        });
    }

    private void ConfigureUrls(IConfiguration configuration)
    {
        Configure<AppUrlOptions>(options =>
        {
            options.Applications["MVC"].RootUrl = configuration["App:SelfUrl"];
            options.Applications["Angular"].RootUrl = configuration["App:AngularUrl"];
            options.Applications["Angular"].Urls[AccountUrlNames.PasswordReset] = "account/reset-password";
            options.RedirectAllowedUrls.AddRange(configuration["App:RedirectAllowedUrls"]?.Split(',') ?? []);
        });
    }

    private void ConfigureBundles()
    {
        Configure<AbpBundlingOptions>(options =>
        {
            options.StyleBundles.Configure(
                LeptonXLiteThemeBundles.Styles.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-styles.css");
                }
            );

            options.ScriptBundles.Configure(
                LeptonXLiteThemeBundles.Scripts.Global,
                bundle =>
                {
                    bundle.AddFiles("/global-scripts.js");
                }
            );
        });
    }


    private void ConfigureVirtualFileSystem(ServiceConfigurationContext context)
    {
        var hostingEnvironment = context.Services.GetHostingEnvironment();

        if (hostingEnvironment.IsDevelopment())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                options.FileSets.ReplaceEmbeddedByPhysical<MallDomainSharedModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Wallee.Mall.Domain.Shared"));
                options.FileSets.ReplaceEmbeddedByPhysical<MallDomainModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Wallee.Mall.Domain"));
                options.FileSets.ReplaceEmbeddedByPhysical<MallApplicationContractsModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Wallee.Mall.Application.Contracts"));
                options.FileSets.ReplaceEmbeddedByPhysical<MallApplicationModule>(Path.Combine(hostingEnvironment.ContentRootPath, $"..{Path.DirectorySeparatorChar}Wallee.Mall.Application"));
            });
        }
    }

    private void ConfigureConventionalControllers()
    {
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            // options.ConventionalControllers.Create(typeof(MallApplicationModule).Assembly);
        });
    }

    private void ConfigureMinio(IConfiguration configuration)
    {
        var minioConnString = configuration.GetConnectionString("minio");

        var map = ParseConnectionString(minioConnString);

        var endPointRaw = map.GetValueOrDefault("EndPoint") ?? configuration["Blob:Minio:EndPoint"];
        var accessKey = map.GetValueOrDefault("AccessKey") ?? configuration["Blob:Minio:AccessKey"];
        var secretKey = map.GetValueOrDefault("SecretKey") ?? configuration["Blob:Minio:SecretKey"];

        var endPoint = NormalizeMinioEndpoint(endPointRaw); // 规范化: 去掉 http(s):// 与末尾 /

        Configure<AbpBlobStoringOptions>(options =>
        {
            options.Containers.Configure<MediaContainer>(container =>
            {
                container.UseMinio(minio =>
                {
                    minio.EndPoint = endPoint ?? throw new InvalidOperationException("Minio EndPoint 未配置");
                    minio.AccessKey = accessKey ?? throw new InvalidOperationException("Minio AccessKey 未配置");
                    minio.SecretKey = secretKey ?? throw new InvalidOperationException("Minio SecretKey 未配置");
                    minio.CreateBucketIfNotExists = true;
                    //minio.BucketName = "media";
                });
            });
        });

        static Dictionary<string, string> ParseConnectionString(string? connectionString)
        {
            var dict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            if (string.IsNullOrWhiteSpace(connectionString)) return dict;
            foreach (var segment in connectionString.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            {
                var kv = segment.Split('=', 2, StringSplitOptions.TrimEntries);
                if (kv.Length == 2 && !string.IsNullOrWhiteSpace(kv[0]))
                {
                    dict[kv[0]] = kv[1];
                }
            }
            return dict;
        }

        static string? NormalizeMinioEndpoint(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return raw;
            var e = raw.Trim();
            if (e.StartsWith("http://", StringComparison.OrdinalIgnoreCase))
                e = e[7..];
            else if (e.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
                e = e[8..];
            e = e.TrimEnd('/');
            return e;
        }
    }

    private static void ConfigureSwagger(ServiceConfigurationContext context, IConfiguration configuration)
    {
        context.Services.AddAbpSwaggerGenWithOidc(
            configuration["AuthServer:Authority"]!,
            ["Mall"],
            [AbpSwaggerOidcFlows.AuthorizationCode],
            null,
            options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Mall API", Version = "v1" });
                options.DocInclusionPredicate((docName, description) => true);
                options.SchemaFilter<SwaggerSchemaFilter>();
                options.CustomSchemaIds(type =>
                {
                    return $"{type.Namespace?.Replace(".", "")}{type.FriendlyId().Replace("[", "Of").Replace("]", "")}";
                });
                options.CustomOperationIds(api =>
                {
                    api.ActionDescriptor.RouteValues.TryGetValue("controller", out var controller);
                    api.ActionDescriptor.RouteValues.TryGetValue("action", out var action);

                    if (!string.IsNullOrEmpty(controller) && !string.IsNullOrEmpty(action))
                    {
                        return $"{controller}_{action}";
                    }

                    var path = api.RelativePath?.Replace("/", "_").Replace("{", "").Replace("}", "");
                    return $"{api.HttpMethod}_{path}";
                });
            });
    }

    private static void ConfigureCors(ServiceConfigurationContext context, IConfiguration configuration)
    {
        context.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder
                    .WithOrigins(
                        configuration["App:CorsOrigins"]?
                            .Split(",", StringSplitOptions.RemoveEmptyEntries)
                            .Select(o => o.Trim().RemovePostFix("/"))
                            .ToArray() ?? []
                    )
                    .WithAbpExposedHeaders()
                    .SetIsOriginAllowedToAllowWildcardSubdomains()
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });
    }




    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();
        var productsAgent = context.ServiceProvider.GetKeyedService<AIAgent>("products");

        app.UseForwardedHeaders();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            app.UseErrorPage();
        }

        app.UseRouting();
        app.MapAbpStaticAssets();
        app.UseAbpStudioLink();
        app.UseAbpSecurityHeaders();
        app.UseCors();
        app.UseAuthentication();
        app.UseAbpOpenIddictValidation();

        if (MultiTenancyConsts.IsEnabled)
        {
            app.UseMultiTenancy();
        }

        app.UseUnitOfWork();
        app.UseDynamicClaims();
        app.UseAuthorization();

        app.UseSwagger();
        app.UseAbpSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "Mall API");

            var configuration = context.ServiceProvider.GetRequiredService<IConfiguration>();
            options.OAuthClientId(configuration["AuthServer:SwaggerClientId"]);
        });
        app.UseAuditing();
        app.UseAbpSerilogEnrichers();
        app.UseConfiguredEndpoints(it =>
        {
            
            it.MapAGUI("/ag-ui/produts", productsAgent!);
        });
    }

    public override async Task OnPostApplicationInitializationAsync(ApplicationInitializationContext context)
    {
        await context.ServiceProvider
            .GetRequiredService<MallDatabaseMigrationChecker>()
            .CheckAndApplyDatabaseMigrationsAsync();
    }
}

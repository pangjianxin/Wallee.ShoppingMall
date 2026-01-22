# 请参阅 https://aka.ms/customizecontainer 以了解如何自定义调试容器，以及 Visual Studio 如何使用此 Dockerfile 生成映像以更快地进行调试。

# 此阶段用于在快速模式(默认为调试配置)下从 VS 运行时
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080


# 此阶段用于生成服务项目
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["NuGet.Config", "."]
COPY ["src/Wallee.Mall.HttpApi.Host/Wallee.Mall.HttpApi.Host.csproj", "src/Wallee.Mall.HttpApi.Host/"]
COPY ["app-host/Wallee.Mall.ServiceDefaults/Wallee.Mall.ServiceDefaults.csproj", "app-host/Wallee.Mall.ServiceDefaults/"]
COPY ["src/Wallee.Mall.Application/Wallee.Mall.Application.csproj", "src/Wallee.Mall.Application/"]
COPY ["src/Wallee.Mall.Domain/Wallee.Mall.Domain.csproj", "src/Wallee.Mall.Domain/"]
COPY ["src/Wallee.Mall.Domain.Shared/Wallee.Mall.Domain.Shared.csproj", "src/Wallee.Mall.Domain.Shared/"]
COPY ["src/Wallee.Mall.Application.Contracts/Wallee.Mall.Application.Contracts.csproj", "src/Wallee.Mall.Application.Contracts/"]
COPY ["src/Wallee.Mall.HttpApi/Wallee.Mall.HttpApi.csproj", "src/Wallee.Mall.HttpApi/"]
COPY ["src/Wallee.Mall.EntityFrameworkCore/Wallee.Mall.EntityFrameworkCore.csproj", "src/Wallee.Mall.EntityFrameworkCore/"]
RUN dotnet restore "./src/Wallee.Mall.HttpApi.Host/Wallee.Mall.HttpApi.Host.csproj"
COPY . .
WORKDIR "/src/src/Wallee.Mall.HttpApi.Host"
RUN dotnet build "./Wallee.Mall.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 此阶段用于发布要复制到最终阶段的服务项目
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Wallee.Mall.HttpApi.Host.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false
# 在发布阶段生成开发证书到发布目录
RUN dotnet dev-certs https -v -ep /app/publish/openiddict.pfx -p 66ef81ca-a7cc-41b5-b852-e29d42de81df
RUN chmod 644 /app/publish/openiddict.pfx
# 此阶段在生产中使用，或在常规模式下从 VS 运行时使用(在不使用调试配置时为默认值)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Wallee.Mall.HttpApi.Host.dll"]
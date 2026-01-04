var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres",
    builder.AddParameter("pg-user", false),
    builder.AddParameter("pg-passwd", secret: true))
    .WithContainerName("postgres")
    .WithDataVolume("postgres")
    .WithImage("postgres", "17.4")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithEndpoint("tcp", options =>
    {
        options.Port = 5432;
    })
    .AddDatabase("mall");

// minio
IResourceBuilder<MinioContainerResource> minio = builder
    .AddMinioContainer("minio",
        builder.AddParameter("minio-user"),
        builder.AddParameter("minio-password", secret: true))
    .WithDataVolume("minio-cre")
    .WithImage("registry.cn-hangzhou.aliyuncs.com/jianxin-cre/minio", tag: "RELEASE.2025-04-22T22-12-26Z")
    .WithEndpoint("http", e =>   // 覆盖默认 API 端点（不要再用 "api" 新增）
    {
        e.UriScheme = "http";
        e.TargetPort = 9000;      // 容器内
        e.Port = 9000;            // 宿主机固定
    })
    .WithEndpoint("console", e => // 覆盖 console 端点
    {
        e.UriScheme = "http";
        e.TargetPort = 9001;
        e.Port = 9001;
    })
    .WithLifetime(ContainerLifetime.Persistent);

builder.AddProject<Projects.Wallee_Mall_HttpApi_Host>("wallee-mall-httpapi-host")
    .WaitFor(postgres)
    .WithReference(postgres, "Default")
    .WaitFor(minio)
    .WithReference(minio); ;

builder.Build().Run();

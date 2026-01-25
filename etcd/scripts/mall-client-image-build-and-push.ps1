
# 定义变量
$dockerHubUsername = "aliyun2825466926"
$dockerHubPassword = '1q2w3E@#$100'
$imageName = "registry.cn-hangzhou.aliyuncs.com/jianxin-zx/mall"
$imageTag = "latest"

$dockerfilePath = "../../mall.client/Dockerfile"
$contextPath = "../../mall.client"

# 捕获所有错误
trap {
    Write-Host "An error occurred: $_"
    Read-Host -Prompt "Press Enter to exit"
    exit 1
}

# 安全地登录到Docker镜像仓库
Write-Host "Logging in to Docker registry..."
Write-Host "Registry: registry.cn-hangzhou.aliyuncs.com"
Write-Host "Username: $dockerHubUsername"

# 首先尝试使用存储的凭据
docker login registry.cn-hangzhou.aliyuncs.com

if ($LASTEXITCODE -ne 0) {
    Write-Host "Stored credentials failed, trying with script credentials..."
    # 如果存储的凭据失败，尝试使用脚本中的凭据
    $dockerHubPassword | docker login registry.cn-hangzhou.aliyuncs.com -u $dockerHubUsername --password-stdin
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker login failed with exit code $LASTEXITCODE."
        Write-Host ""
        Write-Host "请检查以下内容："
        Write-Host "1. 阿里云控制台 -> 容器镜像服务 -> 访问凭证"
        Write-Host "2. 确保使用的是镜像仓库的专用密码，而不是阿里云登录密码"
        Write-Host "3. 用户名格式是否正确"
        Write-Host "4. 网络连接是否正常"
        Write-Host ""
        Write-Host "您可以手动运行以下命令测试登录："
        Write-Host "docker login registry.cn-hangzhou.aliyuncs.com"
        Write-Host ""
        Read-Host -Prompt "Press Enter to exit"
        exit $LASTEXITCODE
    }
} else {
    Write-Host "Using stored credentials successfully!"
}
# 构建 Docker 镜像
Write-Host "Building Docker image..."
docker build -t "${imageName}:${imageTag}" -f $dockerfilePath $contextPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed with exit code $LASTEXITCODE. Exiting..."
    Read-Host -Prompt "Press Enter to exit"
    exit $LASTEXITCODE
}

# 推送 Docker 镜像到 Docker Hub
Write-Host "Pushing Docker image to Docker Hub..."
docker push "${imageName}:${imageTag}"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker push failed with exit code $LASTEXITCODE. Exiting..."
    Read-Host -Prompt "Press Enter to exit"
    exit $LASTEXITCODE
}

Write-Host "Docker image built and pushed successfully!"
Read-Host -Prompt "Press Enter to exit"

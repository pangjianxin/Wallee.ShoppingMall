import { Skeleton } from "@/components/ui/skeleton"



export function SkeletonCard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧：商品图片区域 */}
        <div className="space-y-4">
          {/* 主图 */}
          <Skeleton className="aspect-square w-full rounded-lg" />
          {/* 缩略图列表 */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-md" />
            ))}
          </div>
        </div>

        {/* 右侧：商品信息区域 */}
        <div className="space-y-6">
          {/* 商品标题 */}
          <Skeleton className="h-8 w-3/4" />
          
          {/* 评分区域 */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-16" />
          </div>

          {/* 价格 */}
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>

          {/* 商品描述 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* 分隔线 */}
          <Skeleton className="h-px w-full" />

          {/* 颜色选择 */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-full" />
              ))}
            </div>
          </div>

          {/* 尺寸选择 */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-14 h-10 rounded-md" />
              ))}
            </div>
          </div>

          {/* 数量选择 */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-12 flex-1 rounded-md" />
            <Skeleton className="h-12 w-12 rounded-md" />
          </div>

          {/* 配送信息 */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
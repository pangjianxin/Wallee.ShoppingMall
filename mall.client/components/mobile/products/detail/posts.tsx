"use client";
import { FC, useState } from "react";
import { WalleeMallCmsDtosPostDto, WalleeMallCmsPostCategory } from "@/openapi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@/components/shared/editor/dynamic-editor";
import { cn } from "@/lib/utils";

type Props = {
  posts: WalleeMallCmsDtosPostDto[];
};

// 单个 Post 的内容组件
const PostContent: FC<{
  post: WalleeMallCmsDtosPostDto;
  showTitle?: boolean;
}> = ({ post, showTitle = true }) => {
  const categoryName =
    WalleeMallCmsPostCategory[post.productInfo?.category as number];

  return (
    <div>
      {showTitle && (
        <div className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
          {categoryName}
        </div>
      )}
      <Editor value={post.content || ""} className="rounded-lg bg-muted/20" />
    </div>
  );
};

export const ProductPostTabs: FC<Props> = ({ posts }) => {
  const [tab, setTab] = useState<string>(
    posts.length > 0 ? (posts[0].id as string) : "",
  );

  if (!posts || posts.length === 0) {
    return null;
  }

  // 单个 post 时，直接显示内容，不使用 Tabs
  if (posts.length === 1) {
    return (
      <div className="rounded-lg bg-card px-3 py-4">
        <PostContent post={posts[0]} />
      </div>
    );
  }

  // 多个 posts 时，使用优化后的 Tabs
  return (
    <div className="w-full rounded-lg bg-card px-3 py-4">
      {/* 移动端：使用紧凑的按钮组样式 */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList
          className={cn(
            "mb-1 h-auto w-full flex-wrap justify-start gap-1.5 bg-transparent p-0",
            "md:mb-3 md:inline-flex md:h-10 md:w-auto md:flex-nowrap md:gap-1 md:rounded-lg md:bg-muted/50 md:p-1",
          )}
        >
          {posts.map((post) => {
            const categoryName =
              WalleeMallCmsPostCategory[post.productInfo?.category as number];
            return (
              <TabsTrigger
                key={post.id}
                value={post.id as string}
                className={cn(
                  // 移动端：pill 按钮样式
                  "h-8 rounded-full border border-border bg-background px-3 text-sm font-medium text-muted-foreground",
                  "data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  // 桌面端：恢复标准 tabs 样式
                  "md:h-8 md:rounded-md md:border-transparent md:bg-transparent md:px-3",
                  "md:data-[state=active]:border-transparent md:data-[state=active]:bg-background md:data-[state=active]:text-foreground md:data-[state=active]:shadow-sm",
                )}
              >
                {categoryName}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {posts.map((post) => (
          <TabsContent key={post.id} value={post.id as string} className="mt-3">
            <PostContent post={post} showTitle={false} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

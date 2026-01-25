"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FC, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  WalleeMallCmsDtosPostDto,
  WalleeMallCmsPostCategory,
  WalleeMallProductsDtosProductDto,
} from "@/openapi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderCodeIcon } from "lucide-react";
import Editor from "@/components/shared/editor/editor";

const PostsView: FC<{
  posts: WalleeMallCmsDtosPostDto[];
  product: WalleeMallProductsDtosProductDto;
}> = ({ posts, product }) => {
  const router = useRouter();
  const [tab, setTab] = useState<string>(
    posts.length > 0 ? (posts[0].id as string) : "",
  );
  const handleRedirectToCreate = useCallback(() => {
    router.push(`/products/${product.id}/posts/create`);
  }, [product.id, router]);

  const handleRedirectToUpdate = useCallback(
    (postId: string) => {
      router.push(`/product-posts/${postId}/update`);
    },
    [router],
  );
  if (posts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderCodeIcon />
          </EmptyMedia>
          <EmptyTitle>还没有发布内容</EmptyTitle>
          <EmptyDescription>
            该商品还未发布任何内容，可以点击下方按钮创建新的商品内容。
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex justify-center">
            <Button onClick={handleRedirectToCreate} className="mr-4">
              创建内容
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    );
  }
  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList className="mb-3 w-full justify-start gap-2 overflow-x-auto rounded-md bg-muted/40 p-1">
        {posts.map((post) => (
          <TabsTrigger key={post.id} value={post.id as string}>
            {WalleeMallCmsPostCategory[post.productInfo?.category as number]}
          </TabsTrigger>
        ))}
      </TabsList>
      {posts.map((post) => (
        <TabsContent key={post.id} value={post.id as string}>
          <div className="flex flex-col gap-3">
            <div className="bg-background flex flex-wrap items-center justify-between gap-2">
              <div className="text-base font-medium">
                {
                  WalleeMallCmsPostCategory[
                    post.productInfo?.category as number
                  ]
                }
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="destructive">
                  删除
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleRedirectToUpdate(post.id as string)}
                >
                  编辑
                </Button>
              </div>
            </div>
            <Editor
              value={post.content || ""}
              readonly
              className="h-[40vh] overflow-y-auto rounded-md border bg-muted/20"
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

type Props = {
  product: WalleeMallProductsDtosProductDto;
  posts: WalleeMallCmsDtosPostDto[];
};
export const ProductPostTabs: FC<Props> = ({ product, posts }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        if (!e) {
          router.back();
        }
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="min-w-[800px]"
      >
        <DialogHeader>
          <DialogTitle>商品内容</DialogTitle>
          <DialogDescription>以下是商品的详细内容</DialogDescription>
        </DialogHeader>
        <PostsView posts={posts} product={product} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"destructive"}>关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

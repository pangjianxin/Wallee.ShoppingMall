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
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  WalleeMallCmsDtosProductPostDto,
  WalleeMallCmsProductPostCategory,
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
import Link from "next/link";

const PostsView: FC<{
  posts: WalleeMallCmsDtosProductPostDto[];
  product: WalleeMallProductsDtosProductDto;
}> = ({ posts, product }) => {
  const [tab, setTab] = useState<string>(
    posts.length > 0 ? (posts[0].id as string) : "",
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
            <Link
              href={`/products/${product.id}/posts/create`}
              className="font-medium"
            >
              创建内容
            </Link>
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
            {WalleeMallCmsProductPostCategory[post.category as number]}
          </TabsTrigger>
        ))}
      </TabsList>
      {posts.map((post) => (
        <TabsContent key={post.id} value={post.id as string}>
          <div className="flex flex-col gap-3">
            <div className="bg-background flex flex-wrap items-center justify-between gap-2">
              <div className="text-base font-medium">
                {WalleeMallCmsProductPostCategory[post.category as number]}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="destructive">
                  删除
                </Button>
                <Button size="sm" variant="default" asChild>
                  <Link
                    href={`/products/${product.id}/posts/${post.id}/update`}
                  >
                    编辑
                  </Link>
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
  posts: WalleeMallCmsDtosProductPostDto[];
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
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>商品内容</DialogTitle>
          <DialogDescription>以下是商品的详细内容</DialogDescription>
        </DialogHeader>
        <PostsView posts={posts} product={product} />
        <DialogFooter>
          <Button>
            <Link href={`/products/${product.id}/posts/create`}>创建内容</Link>
          </Button>
          <DialogClose asChild>
            <Button variant={"destructive"}>关闭</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

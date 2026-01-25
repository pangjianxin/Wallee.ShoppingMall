import { FC } from "react";
import { WalleeMallCmsDtosPostDto, WalleeMallCmsPostCategory } from "@/openapi";
import { PermissionButton } from "@/components/auth/permission-button";
import Link from "next/link";
import { Editor } from "@/components/shared/editor/dynamic-editor";
import { createSerializer, parseAsString } from "nuqs/server";

const serialize = createSerializer({
  productId: parseAsString,
});

type Props = {
  posts?: WalleeMallCmsDtosPostDto[];
  productId?: string;
};
export const ProductPosts: FC<Props> = ({ posts, productId }) => {
  return (
    <div className="flex flex-col gap-4">
      {posts?.length === 0 && (
        <p className="text-sm text-muted-foreground">暂无内容</p>
      )}
      {posts?.map((post) => {
        const serializedUpdatePostUrl = serialize(`/posts/${post.id}/update`, {
          productId: productId,
        });
        const serializedDeletePostUrl = serialize(`/posts/${post.id}/delete`, {
          productId: productId,
        });
        return (
          <div key={post.id} className="rounded-md border border-dashed p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {
                  WalleeMallCmsPostCategory[
                    post.productInfo?.category as number
                  ]
                }
              </h3>
              {post.id && (
                <div className="flex gap-2 items-center">
                  <PermissionButton
                    asChild
                    size="sm"
                    variant="destructive"
                    permission="Mall.Post.Delete"
                  >
                    <Link href={serializedDeletePostUrl}>删除</Link>
                  </PermissionButton>
                  <PermissionButton
                    asChild
                    size="sm"
                    variant="outline"
                    permission="Mall.Post.Update"
                  >
                    <Link href={serializedUpdatePostUrl}>编辑</Link>
                  </PermissionButton>
                </div>
              )}
            </div>
            <Editor value={post.content || "<p>无内容</p>"} readonly={true} />
          </div>
        );
      })}
    </div>
  );
};

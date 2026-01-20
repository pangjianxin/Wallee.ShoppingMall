"use server";
import {
  tagGetPopularTags,
  tagGetList,
  productTagSetProductTags,
  tagGetAllRelatedTags,
} from "@/openapi";
import { client } from "@/hey-api/client";

export const filterTags = async ({ search }: { search?: string }) => {
  if (!search) {
    const { data } = await tagGetPopularTags({
      throwOnError: true,
      client: client,
      path: {
        maxCount: 20,
      },
    });
    //  return data.map((it) => it.name!);
    return data?.map((it) => ({ label: it.name!, value: it.name! })) || [];
  } else {
    const { data } = await tagGetList({
      throwOnError: true,
      client: client,
      query: {
        MaxResultCount: 10,
        SkipCount: 0,
        "NormalizedName.Contains": search,
        Sorting: "name asc",
      },
    });
    // return data.items?.map((it) => it.name!) || [];
    return (
      data.items?.map((it) => ({ label: it.name!, value: it.name! })) || []
    );
  }
};

export const setTagsToProduct = async (tags: string[], productId: string) => {
  await productTagSetProductTags({
    throwOnError: true,
    client: client,
    body: {
      tags: tags,
      productId: productId,
    },
  });
};

export const getRelatedTags = async (productId: string) => {
  const { data } = await tagGetAllRelatedTags({
    throwOnError: true,
    client: client,
    path: {
      productId: productId,
    },
  });
  return data.map((it) => ({
    label: it.name!,
    value: it.name!,
  }));
};

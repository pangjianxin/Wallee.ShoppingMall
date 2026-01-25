"use server";
import { client } from "@/hey-api/client";
import {
  cartAddItem,
  cartRemoveItem,
  cartUpdateQuantity,
  cartSetItemSelected,
  cartSelectAll,
} from "@/openapi";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export type AddToCartState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const addItemToCartSchema = z.object({
  skuId: z.string().min(1, "请选择商品规格"),
  quantity: z.coerce.number().optional().default(1),
});

const removeItemFromCartSchema = z.object({
  itemId: z.string().min(1, "请选择要删除的商品项"),
});

const updateItemQuantitySchema = z
  .object({
    itemId: z.string().min(1, "请选择要更新的商品项"),
    quantity: z.coerce.number().min(1, "数量必须至少为1"),
    stockQuantity: z.preprocess(
      (value) => (value === "" || value == null ? undefined : value),
      z.coerce.number().int().nonnegative().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (
      data.stockQuantity !== undefined &&
      data.quantity > data.stockQuantity
    ) {
      ctx.addIssue({
        code: "too_big",
        origin: "number",
        maximum: data.stockQuantity,
        message: `库存不足，最大可购买数量为 ${data.stockQuantity}`,
        path: ["quantity"],
      });
    }
  });

const updateItemSelectionSchema = z.object({
  itemId: z.string().min(1, "请选择要更新的商品项"),
  isSelected: z.coerce.boolean(),
});

const updateItemSelectionAllSchema = z.object({
  isSelected: z.coerce.boolean(),
});

// 添加商品项（Sku）到购物车
export const addItemToCart = async (initialState: any, formData: FormData) => {
  const validatedFields = addItemToCartSchema.safeParse({
    skuId: formData.get("skuId"),
    quantity: formData.get("quantity"),
  });

  if (!validatedFields.success) {
    const fieldErrors = z.treeifyError(validatedFields.error);
    const skuIdError = fieldErrors.properties?.skuId?.errors?.[0];
    const quantityError = fieldErrors.properties?.quantity?.errors?.[0];
    return {
      status: "error",
      message: skuIdError || quantityError || "表单验证失败",
    };
  }
  try {
    await cartAddItem({
      client: client,
      body: {
        skuId: validatedFields.data.skuId,
        quantity: validatedFields.data.quantity,
      },
    });
    return { status: "success", message: "已加入购物车" };
  } catch {
    return { status: "error", message: "加入失败，请重试" };
  }
};

// 从购物车移除商品项(Sku)
export const removeItemFromCart = async (
  initialState: any,
  formData: FormData,
) => {
  const validatedFields = removeItemFromCartSchema.safeParse({
    itemId: formData.get("itemId"),
  });

  if (!validatedFields.success) {
    const fieldErrors = z.treeifyError(validatedFields.error);
    const itemIdError = fieldErrors.properties?.itemId?.errors?.[0];
    return {
      status: "error",
      message: itemIdError || "表单验证失败",
    };
  }

  try {
    await cartRemoveItem({
      client: client,
      body: {
        itemId: validatedFields.data.itemId,
      },
    });
    revalidatePath("/carts");
    return { status: "success", message: "已从购物车移除" };
  } catch (error) {
    console.error("从购物车移除商品失败:", error);
    return { status: "error", message: "移除失败，请重试" };
  }
};

// 更新购物车中商品项(Sku)的数量
export const updateItemQuantity = async (
  initialState: any,
  formData: FormData,
) => {
  const validatedFields = updateItemQuantitySchema.safeParse({
    itemId: formData.get("itemId"),
    quantity: formData.get("quantity"),
    stockQuantity: formData.get("stockQuantity"),
  });

  if (!validatedFields.success) {
    const fieldErrors = z.treeifyError(validatedFields.error);
    const itemIdError = fieldErrors.properties?.itemId?.errors?.[0];
    const quantityError = fieldErrors.properties?.quantity?.errors?.[0];
    return {
      status: "error",
      message: itemIdError || quantityError || "表单验证失败",
    };
  }

  try {
    await cartUpdateQuantity({
      client: client,
      body: {
        itemId: validatedFields.data.itemId,
        quantity: validatedFields.data.quantity,
      },
    });
    revalidatePath("/carts");
    return { status: "success", message: "已更新商品数量" };
  } catch (error) {
    console.error("更新购物车中商品数量失败:", error);
    return { status: "error", message: "更新失败，请重试" };
  }
};

// 更新购物车中商品项(Sku)的选中状态
export const updateItemSelection = async (
  initialState: any,
  formData: FormData,
) => {
  const validatedFields = updateItemSelectionSchema.safeParse({
    itemId: formData.get("itemId"),
    isSelected: formData.get("isSelected"),
  });

  console.log("Validated Fields:", validatedFields);

  if (!validatedFields.success) {
    const fieldErrors = z.treeifyError(validatedFields.error);
    const itemIdError = fieldErrors.properties?.itemId?.errors?.[0];

    return {
      status: "error",
      message: itemIdError || "表单验证失败",
    };
  }

  try {
    await cartSetItemSelected({
      client: client,
      body: {
        itemId: validatedFields.data.itemId,
        isSelected: validatedFields.data.isSelected,
      },
    });
    revalidatePath("/carts");
    return { status: "success", message: "已更新商品选中状态" };
  } catch (error) {
    console.error("更新购物车中商品选中状态失败:", error);
    return { status: "error", message: "更新失败，请重试" };
  }
};

// 更新购物车中商品项(Sku)的选中状态
export const updateItemSelectedAll = async (
  initialState: any,
  formData: FormData,
) => {
  const validatedFields = updateItemSelectionAllSchema.safeParse({
    isSelected: formData.get("isSelected"),
  });

  if (!validatedFields.success) {
    const fieldErrors = z.treeifyError(validatedFields.error);
    const isSelectedError = fieldErrors.properties?.isSelected?.errors?.[0];

    return {
      status: "error",
      message: isSelectedError || "表单验证失败",
    };
  }

  try {
    await cartSelectAll({
      client: client,
      body: {
        isSelected: validatedFields.data.isSelected,
      },
    });
    revalidatePath("/carts");
    return { status: "success", message: "已更新商品选中状态" };
  } catch (error) {
    console.error("更新购物车中商品选中状态失败:", error);
    return { status: "error", message: "更新失败，请重试" };
  }
};

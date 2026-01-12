"use client";

import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, X } from "lucide-react";
import { useUpdateProductSkus } from "@/hooks/products/update-skus";
import type { WalleeMallProductsDtosProductDto } from "@/openapi";
import { Checkbox } from "@/components/ui/checkbox";
import { executeOperation } from "@/lib/execute-operation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDiscountText } from "@/lib/utils";

interface ProductSkuFormProps {
  entity: WalleeMallProductsDtosProductDto;
}

export function ProductSkuForm({ entity }: ProductSkuFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const { form, submit } = useUpdateProductSkus({ entity });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await executeOperation(
      async () => {
        await submit(data);
      },
      {
        successMessage: "操作成功",
        onSuccess: async () => {
          setOpen(false);
          form.reset();
          router.back();
        },
      }
    );
  });

  const addNewSku = () => {
    append({
      id: "",
      skuCode: "",
      originalPrice: 0,
      discountRate: 1,
      jdPrice: 0,
      currency: "CNY",
      stockQuantity: 0,
      attributes: [],
    });
  };

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
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          id="product-skus-form"
        >
          <DialogContent className="sm:max-w-3xl sm:max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{entity.name}</DialogTitle>
              <DialogDescription>
                完成下列表单以更新商品 SKU 列表
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">SKU 管理</h2>
              <Button type="button" onClick={addNewSku}>
                <Plus className="mr-2 h-4 w-4" />
                添加 SKU
              </Button>
            </div>

            {fields.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    暂无 SKU,请添加一个
                  </p>
                  <Button type="button" onClick={addNewSku}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加第一个 SKU
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <SkuCard
                  key={field.id}
                  index={index}
                  form={form}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>

            {form.formState.errors.items && (
              <p className="text-sm text-destructive">
                {form.formState.errors.items.message}
              </p>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="validateSkuCodeUniqueness"
                checked={form.watch("validateSkuCodeUniqueness")}
                onCheckedChange={(checked) =>
                  form.setValue("validateSkuCodeUniqueness", checked as boolean)
                }
              />
              <Label
                htmlFor="validateSkuCodeUniqueness"
                className="cursor-pointer"
              >
                验证 SKU 编码唯一性
              </Label>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => form.reset()}
                >
                  关闭
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                form="product-skus-form"
              >
                {form.formState.isSubmitting ? "保存中..." : "保存所有 SKU"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}

interface SkuCardProps {
  index: number;
  form: ReturnType<typeof useUpdateProductSkus>["form"];
  onRemove: () => void;
}

function SkuCard({ index, form, onRemove }: SkuCardProps) {
  const attributes = form.watch(`items.${index}.attributes`) || []; // 改为数组默认值

  const addAttribute = () => {
    form.setValue(`items.${index}.attributes`, [
      ...attributes,
      { key: "", value: "" },
    ]);
  };

  const removeAttribute = (attrIndex: number) => {
    const newAttributes = attributes.filter((_, i) => i !== attrIndex);
    form.setValue(`items.${index}.attributes`, newAttributes);
  };

  const updateAttributeKey = (attrIndex: number, newKey: string) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex] = {
      ...newAttributes[attrIndex],
      key: newKey,
    };
    form.setValue(`items.${index}.attributes`, newAttributes);
  };

  const updateAttributeValue = (attrIndex: number, newValue: string) => {
    const newAttributes = [...attributes];
    newAttributes[attrIndex] = {
      ...newAttributes[attrIndex],
      value: newValue,
    };
    form.setValue(`items.${index}.attributes`, newAttributes);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">SKU #{index + 1}</CardTitle>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`items.${index}.id`}
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value} />
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`items.${index}.skuCode`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU 编码</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="输入 SKU 编码"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.currency`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>选择货币</FormLabel>
                <Select {...field}>
                  <FormControl>
                    <SelectTrigger className="border-slate-300 focus:border-amber-500 focus:ring-amber-500 w-full">
                      <SelectValue placeholder="请选择时段" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem key={"CNY"} value={"CNY"}>
                      CNY
                    </SelectItem>
                    <SelectItem key={"USD"} value={"USD"}>
                      USD
                    </SelectItem>
                    <SelectItem key={"JPY"} value={"JPY"}>
                      JPY
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.originalPrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>原价</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.value ?? 0}
                    onChange={(e) => {
                      const raw = e.target.value;
                      field.onChange(raw === "" ? 0 : Number(raw));
                    }}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.discountRate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>折扣率(0-1)</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      step="0.01"
                      value={field.value ?? 0}
                      onChange={(e) => {
                        const raw = e.target.value;
                        field.onChange(raw === "" ? 0 : Number(raw));
                      }}
                      placeholder="0.00"
                    />
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupText>
                        {getDiscountText(field.value)}
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.jdPrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>京东价格</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      field.onChange(raw === "" ? null : Number(raw));
                    }}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.stockQuantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>库存数量</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? 0}
                    onChange={(e) => {
                      const raw = e.target.value;
                      field.onChange(raw === "" ? 0 : Number(raw));
                    }}
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-accent">
            <Label>属性 (Attributes)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAttribute}
            >
              <Plus className="mr-2 h-3 w-3" />
              添加属性
            </Button>
          </div>

          {attributes.length === 0 ? (
            <div className="text-sm text-muted-foreground border border-dashed rounded-md p-4 text-center">
              暂无属性，点击上方按钮添加
            </div>
          ) : (
            <div className="space-y-2">
              {attributes.map((attr, attrIndex) => (
                <div key={attrIndex} className="flex gap-2 items-center">
                  <Input
                    placeholder="属性名"
                    value={attr.key || ""}
                    onChange={(e) =>
                      updateAttributeKey(attrIndex, e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="属性值"
                    value={attr.value || ""}
                    onChange={(e) =>
                      updateAttributeValue(attrIndex, e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttribute(attrIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

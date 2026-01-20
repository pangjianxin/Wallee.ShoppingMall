"use client";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { setTagsToProduct, getRelatedTags, filterTags } from "@/actions/tags";

interface Props {
  productId?: string; //关联实体的ID
}

export interface TagSelectorRef {
  onSubmit?: (id: string) => Promise<void>;
}

export const TagSelector = forwardRef<TagSelectorRef, Props>(
  ({ productId }, ref) => {
    const [initOptions, setInitOptions] = useState<Option[] | undefined>(
      undefined,
    );
    const [values, setValues] = useState<Option[] | undefined>(undefined);

    useImperativeHandle(ref, () => {
      return {
        async onSubmit(id: string) {
          if (values && values.length > 0) {
            await setTagsToProduct(
              values.map((it) => it.label),
              id,
            );
          }
        },
      };
    });

    useEffect(() => {
      const init = async () => {
        const initOptions = await filterTags({ search: undefined });
        setInitOptions(initOptions);
        if (productId) {
          const initValues = await getRelatedTags(productId);
          setValues(initValues);
        } else {
          setValues(undefined);
        }
      };
      init();
    }, [productId]);

    return (
      <MultipleSelector
        defaultOptions={initOptions}
        triggerSearchOnFocus
        delay={500}
        value={values}
        creatable
        onChange={(value) => setValues(value)}
        onSearch={async (search) => {
          const res = await filterTags({ search });
          return res ?? [];
        }}
        placeholder="继续搜索查找或创建标签"
        loadingIndicator={
          <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
            加载中
          </p>
        }
        emptyIndicator={
          <p className="w-full text-center text-lg leading-10 text-muted-foreground">
            没有搜索结果..
          </p>
        }
      />
    );
  },
);

TagSelector.displayName = "TagSelector";

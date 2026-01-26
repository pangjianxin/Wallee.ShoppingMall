"use client";
import { CopilotKit } from "@copilotkit/react-core";
import CopilotChat from "@/components/mobile/ai/copilot-chat";
import { FC } from "react";
import { ProductSearchRenderer } from "@/components/mobile/products/ai/tool-renderers";
import { useSession } from "@/lib/auth-client";

const ProductsChat: FC = () => {
  const session = useSession();
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      agent="products"
      //runtimeUrl="/ag-ui/products"
      headers={{
        Authorization: `Bearer ${session?.data?.session.token}`,
      }}
      renderToolCalls={[ProductSearchRenderer]}
    >
      <CopilotChat agentId="products" />
    </CopilotKit>
  );
};

export default ProductsChat;

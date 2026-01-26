"use client";

import {useMemo } from "react";
import { CopilotChat, ToolsMenuItem } from "@copilotkit/react-core/v2";
import "@copilotkit/react-ui/styles.css";

export const dynamic = "force-dynamic";

export default function CopilotChatV({ agentId }: { agentId?: string }) {
  const toolsMenu = useMemo<(ToolsMenuItem | "-")[]>(
    () => [
      {
        label: "友情链接",
        action: () => {
          window.open("https://jd.com", "_blank", "noopener,noreferrer");
        },
      },
    ],
    [],
  );

  //const { agent } = useAgent({ agentId: "comprehensive" });
  return (
    <CopilotChat
      agentId={agentId}
      className="mt-2"
      labels={{
        chatDisclaimerText: "AI可能会生成不准确的信息,请谨慎使用。",
        chatInputPlaceholder: "我是您的智能导购,请输入您的问题...",
      }}
      inputProps={{
        toolsMenu: toolsMenu,
      }}
    />
  );
}

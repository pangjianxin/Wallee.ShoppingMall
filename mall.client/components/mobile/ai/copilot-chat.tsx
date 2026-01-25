"use client";

import { useEffect, useMemo, useRef } from "react";
import { CopilotChat, ToolsMenuItem } from "@copilotkit/react-core/v2";

import { useEventBus } from "@/stores/event-bus";
import "@copilotkit/react-ui/styles.css";

export const dynamic = "force-dynamic";

export default function ComprehensiveChat() {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const subscribe = useEventBus((state) => state.subscribe);

  const toolsMenu = useMemo<(ToolsMenuItem | "-")[]>(
    () => [
      {
        label: "友情链接",
        action: () => {
          window.open(
            "https://jd.com",
            "_blank",
            "noopener,noreferrer"
          );
        },
      },
    ],
    []
  );

  // Imperatively set the textarea value to keep IME composition intact while still allowing external prefill
  useEffect(() => {
    const unsubscribe = subscribe("chatPrefill", (prefill) => {
      const el = textAreaRef.current;
      if (!el) return;
      const setter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value"
      )?.set;
      setter?.call(el, prefill);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    return unsubscribe;
  }, [subscribe]);

  //const { agent } = useAgent({ agentId: "comprehensive" });
  return (
    <CopilotChat
      className="mt-2"
      labels={{
        chatDisclaimerText: "AI可能会生成不准确的信息,请谨慎使用。",
        chatInputPlaceholder: "我是您的智能导购,请输入您的问题...",
      }}
      inputProps={{
        toolsMenu: toolsMenu,
        textArea: {
          ref: (el) => {
            textAreaRef.current = el;
          },
        },
      }}
    />
  );
}

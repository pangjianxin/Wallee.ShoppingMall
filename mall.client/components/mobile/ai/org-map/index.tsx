"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import CopilotChat from "@/components/mobile/ai/copilot-chat";
import AMap from "@/components/mobile/ai/amap/map";
import { CopilotKit } from "@copilotkit/react-core";
import { useSession } from "next-auth/react";
import {
  WeatherCardRenderer,
  AroundSearchRenderer,
  SearchDetailRenderer,
} from "@/components/mobile/ai/copilot-chat/tool-renderers";

export default function OrgMap() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  return (
    <ResizablePanelGroup
      direction={isMobile ? "vertical" : "horizontal"}
      className="h-full w-full"
    >
      <ResizablePanel defaultSize={45} minSize={30} className="h-full min-h-0">
        <AMap />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={55} minSize={30} className="h-full min-h-0">
        <CopilotKit
          runtimeUrl="/api/copilotkit"
          headers={{
            Authorization: `Bearer ${session?.accessToken}`,
          }}
          renderToolCalls={[
            WeatherCardRenderer,
            AroundSearchRenderer,
            SearchDetailRenderer,
          ]}
          agent="amap"
        >
          <CopilotChat />
        </CopilotKit>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

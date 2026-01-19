import { CopilotKit } from "@copilotkit/react-core";
import CopilotChat from "@/components/mobile/ai/copilot-chat";
import { FC } from "react";

const ComprehensiveChat: FC = () => {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="products">
      <CopilotChat />
    </CopilotKit>
  );
};

export default ComprehensiveChat;

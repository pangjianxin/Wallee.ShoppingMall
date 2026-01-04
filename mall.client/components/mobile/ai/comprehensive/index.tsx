import { CopilotKit } from "@copilotkit/react-core";
import CopilotChat from "@/components/mobile/ai/copilot-chat";
import { FC } from "react";

const ComprehensiveChat: FC = () => {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent="comprehensive">
      <CopilotChat />
    </CopilotKit>
  );
};

export default ComprehensiveChat;

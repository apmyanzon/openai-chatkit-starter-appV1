import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatKitOptions } from "@openai/chatkit";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

export function ChatKitPanel() {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const chatkitOptions: ChatKitOptions = {
    startScreen: {
      greeting:
        "Hi, I’m Install Genius Pulse. Ask me anything about Pulse installation, mounting orientation, wiring, setup, or troubleshooting."
    }
  };

  const chatkit = useChatKit({
    api: { getClientSecret }
  });

  return (
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit
        control={chatkit.control}
        options={chatkitOptions}
        className="h-full w-full"
      />
    </div>
  );
}

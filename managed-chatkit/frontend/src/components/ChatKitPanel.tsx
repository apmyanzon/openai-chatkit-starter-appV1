import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatKitOptions } from "@openai/chatkit";
import {
  createClientSecretFetcher,
  workflowId,
} from "../lib/chatkitSession";

export function ChatKitPanel() {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const options: ChatKitOptions = {
    api: {
      getClientSecret,
    },

    theme: {
      colorScheme: "light",
      radius: "pill",
      density: "normal",
      typography: {
        baseSize: 16,
        fontFamily:
          '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontFamilyMono:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      },
    },

    /**
     * Keep file/photo uploads OFF until the client
     * explicitly approves their data handling.
     *
     * ChatKit attachments are disabled by default when
     * attachment configuration is omitted.
     */
    composer: {
      attachments: {
        enabled: false,
      },
    },

    /**
     * Do not expose the thread-history UI for this
     * public anonymous assistant.
     */
    history: {
      enabled: false,
    },

    startScreen: {
      greeting:
        "Hi, I’m Install Genius. Ask me anything about Pulse, Live Wire, or VFU.",
      prompts: [],
    },
  };

  const chatkit = useChatKit(options);

  return (
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm">
      <ChatKit
        control={chatkit.control}
        options={options}
        className="h-full w-full"
      />
    </div>
  );
}

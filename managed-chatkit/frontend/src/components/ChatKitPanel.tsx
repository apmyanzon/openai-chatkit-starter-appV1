import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { ChatKitOptions } from "@openai/chatkit";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

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

    composer: {
      attachments: {
        enabled: true,
        maxCount: 5,
        maxSize: 10_485_760,
      },
    },

    startScreen: {
      greeting:
        "Hi, I’m Install Genius Pulse. Ask me anything about Symterra Pulse.",
      prompts: [],
    },
  };

  const chatkit = useChatKit(options);

  return (
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm dark:bg-slate-900">
      <ChatKit
        control={chatkit.control}
        options={options}
        className="h-full w-full"
      />
    </div>
  );
}

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
      // This is the greeting text (usually smaller text / helper line)
      greeting:
        "Hi, I’m Install Genius Pulse. Ask me anything about Pulse installation, mounting orientation, wiring, setup, or troubleshooting.",

      // If supported by your ChatKit version, this changes the BIG title:
      // title: "Install Genius Pulse",
    },

    // Optional starter buttons (if supported)
    // starterPrompts: [
    //   { title: "Installation checklist", prompt: "Give me the Pulse installation checklist." },
    //   { title: "Mounting orientation", prompt: "Does it matter if I mount the box vertically or horizontally?" },
    //   { title: "Wiring help", prompt: "Walk me through the wiring setup." },
    // ],
  };

  const chatkit = useChatKit({
    api: { getClientSecret },
    options: chatkitOptions, // <-- add this
  });

  return (
    <div className="flex h-[90vh] w-full rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit
        control={chatkit.control}
        options={chatkitOptions} // <-- keep this too
        className="h-full w-full"
      />
    </div>
  );
}

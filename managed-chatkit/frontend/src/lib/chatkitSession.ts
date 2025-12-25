const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export const workflowId = (() => {
  const id = readEnvString(import.meta.env.VITE_CHATKIT_WORKFLOW_ID);
  if (!id || !id.startsWith("wf_")) {
    throw new Error("Set VITE_CHATKIT_WORKFLOW_ID in your environment variables.");
  }
  return id;
})();

const backendBaseUrl = (() => {
  const url = readEnvString(import.meta.env.VITE_CHATKIT_BACKEND_URL);
  // If you deploy frontend + backend in ONE Vercel project, you can leave this empty
  // and it will use same-origin.
  return url ? url.replace(/\/$/, "") : "";
})();

export function createClientSecretFetcher(
  workflow: string,
  endpoint = `${backendBaseUrl}/api/create-session`
) {
  // If backendBaseUrl is empty, endpoint becomes "/api/create-session" (same-origin)
  const finalEndpoint = endpoint.startsWith("http") ? endpoint : "/api/create-session";

  return async (currentSecret: string | null) => {
    if (currentSecret) return currentSecret;

    const response = await fetch(finalEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // IMPORTANT: backend expects workflowId, not workflow:{id:...}
      body: JSON.stringify({ workflowId: workflow, user: "web" }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      client_secret?: string;
      error?: string;
      details?: any;
    };

    if (!response.ok) {
      throw new Error(payload.error || payload.details?.error?.message || "Failed to create session");
    }

    if (!payload.client_secret) {
      throw new Error("Missing client_secret in response");
    }

    return payload.client_secret;
  };
}

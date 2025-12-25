const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export const workflowId = (() => {
  const id = readEnvString(import.meta.env.VITE_CHATKIT_WORKFLOW_ID);
  if (!id || id.startsWith("wf_replace")) {
    throw new Error("Set VITE_CHATKIT_WORKFLOW_ID in your environment variables.");
  }
  return id;
})();

const apiBaseUrl = (() => {
  const v = readEnvString(import.meta.env.VITE_CHATKIT_API_BASE_URL);
  // If not set, fallback to same origin (only works if backend + frontend are deployed together)
  return v ?? "";
})();

export function createClientSecretFetcher(
  workflow: string,
  endpoint = "/api/create-session"
) {
  const url = apiBaseUrl ? `${apiBaseUrl}${endpoint}` : endpoint;

  return async (currentSecret: string | null) => {
    if (currentSecret) return currentSecret;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow: { id: workflow } }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      client_secret?: string;
      error?: string;
      details?: any;
    };

    if (!response.ok) {
      throw new Error(payload.error || `Failed to create session (${response.status})`);
    }

    if (!payload.client_secret) {
      throw new Error("Missing client_secret in response");
    }

    return payload.client_secret;
  };
}

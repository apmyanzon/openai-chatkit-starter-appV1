const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

const joinUrl = (base: string, path: string) => {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

export const workflowId = (() => {
  const id = readEnvString(import.meta.env.VITE_CHATKIT_WORKFLOW_ID);
  if (!id || !id.startsWith("wf_")) {
    throw new Error("Set VITE_CHATKIT_WORKFLOW_ID in your env vars.");
  }
  return id;
})();

export const apiBaseUrl = (() => {
  const v = readEnvString(import.meta.env.VITE_CHATKIT_API_BASE_URL);
  // Optional: if not set, use same-origin (works only if frontend+backend are same project)
  return v;
})();

export function createClientSecretFetcher(workflow: string) {
  const endpoint = apiBaseUrl
    ? joinUrl(apiBaseUrl, "/api/create-session")
    : "/api/create-session";

  return async (currentSecret: string | null) => {
    if (currentSecret) return currentSecret;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflowId: workflow,
        user: "web-user-1",
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.error || "Failed to create session");
    }

    if (!payload?.client_secret) {
      throw new Error("Missing client_secret in response");
    }

    return payload.client_secret as string;
  };
}

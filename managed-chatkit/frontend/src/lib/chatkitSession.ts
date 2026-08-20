const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export const workflowId = (() => {
  const id = readEnvString(import.meta.env.VITE_CHATKIT_WORKFLOW_ID);

  if (!id || !id.startsWith("wf_")) {
    throw new Error(
      "Set VITE_CHATKIT_WORKFLOW_ID in your environment variables."
    );
  }

  return id;
})();

const backendBaseUrl = (() => {
  const url = readEnvString(import.meta.env.VITE_CHATKIT_BACKEND_URL);

  return url ? url.replace(/\/$/, "") : "";
})();

/**
 * Returns a stable, anonymous ID unique to this browser.
 *
 * The ID persists in localStorage so refreshing the page does not create
 * a completely new ChatKit identity.
 */
function getVisitorId(): string {
  const storageKey = "install_genius_visitor_id";

  let visitorId = localStorage.getItem(storageKey);

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(storageKey, visitorId);
  }

  return visitorId;
}

export function createClientSecretFetcher(
  workflow: string,
  endpoint = `${backendBaseUrl}/api/create-session`
) {
  const finalEndpoint = endpoint.startsWith("http")
    ? endpoint
    : "/api/create-session";

  return async (currentSecret: string | null) => {
    if (currentSecret) {
      return currentSecret;
    }

    const response = await fetch(finalEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflowId: workflow,
        user: getVisitorId(),
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      client_secret?: string;
      error?: string;
      details?: {
        error?: {
          message?: string;
        };
      };
    };

    if (!response.ok) {
      throw new Error(
        payload.error ||
          payload.details?.error?.message ||
          "Failed to create session"
      );
    }

    if (!payload.client_secret) {
      throw new Error("Missing client_secret in response");
    }

    return payload.client_secret;
  };
}

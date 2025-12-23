import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const workflowId = process.env.CHATKIT_WORKFLOW_ID;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY env var" });
    }

    if (!workflowId || !workflowId.startsWith("wf_")) {
      return res.status(500).json({
        error: "Server misconfigured: CHATKIT_WORKFLOW_ID missing or invalid",
      });
    }

    const { user } = req.body || {};

    // user can be any stable ID (user id, device id, etc.)
    const userId =
      typeof user === "string" && user.length ? user : "anonymous";

    const r = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: userId,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: "OpenAI error",
        details: data,
      });
    }

    // Returns client_secret, status, session id, etc.
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({
      error: e?.message || "Server error",
    });
  }
}

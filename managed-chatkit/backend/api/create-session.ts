import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY env var" });
    }

    const { workflowId, user } = req.body || {};
    if (!workflowId || typeof workflowId !== "string" || !workflowId.startsWith("wf_")) {
      return res.status(400).json({ error: "Missing/invalid workflowId" });
    }

    // user can be any stable id you choose (device id, user id, etc.)
    const userId = typeof user === "string" && user.length ? user : "anonymous";

    const r = await fetch("https://api.openai.com/v1/chatkit/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
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

    // Expecting { client_secret: "..." }
    return res.status(200).json(data);
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}

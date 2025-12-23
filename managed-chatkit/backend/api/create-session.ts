import OpenAI from "openai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const workflowId = req.body?.workflow?.id;

  if (typeof workflowId !== "string" || !workflowId.startsWith("wf_")) {
    return res.status(400).json({ error: "Invalid workflow id" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const client = new OpenAI({ apiKey });

    const session = await client.chatkit.sessions.create({
      workflow: { id: workflowId },
    });

    return res.status(200).json({
      client_secret: session.client_secret,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err?.message || "Server error",
    });
  }
}

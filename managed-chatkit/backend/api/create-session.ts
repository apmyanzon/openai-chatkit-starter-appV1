import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const workflowId = req.body?.workflow?.id;

  if (!workflowId || !workflowId.startsWith("wf_")) {
    return res.status(400).json({ error: "Invalid workflow id" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  const client = new OpenAI({ apiKey });

  const session = await client.chatkit.sessions.create({
    workflow: { id: workflowId },
  });

  return res.status(200).json({
    client_secret: session.client_secret,
  });
}

import OpenAI from "openai";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.json().catch(() => ({}));
  const workflowId = body?.workflow?.id;

  if (!workflowId) {
    return new Response(
      JSON.stringify({ error: "Missing workflow id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const session = await client.chatkit.sessions.create({
    workflow: { id: workflowId },
  });

  return new Response(
    JSON.stringify({ client_secret: session.client_secret }),
    { headers: { "Content-Type": "application/json" } }
  );
}

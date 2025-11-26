// Akenotech/src/app/api/generate-video/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, duration } = body ?? {};

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (!duration) {
      return NextResponse.json(
        { error: "Duration is required." },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_START_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Server is not configured (missing N8N_START_WEBHOOK_URL)." },
        { status: 500 }
      );
    }

    const site = "akenotech";

    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, duration, site }),
    });

    if (!n8nRes.ok) {
      const text = await n8nRes.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Failed to start video generation.",
          details: text || n8nRes.statusText,
        },
        { status: 502 }
      );
    }

    const data = await n8nRes.json().catch(() => ({}));
    const jobId = (data as any).jobId ?? (data as any).id ?? (data as any).workflowId;

    if (!jobId || typeof jobId !== "string") {
      return NextResponse.json(
        {
          error: "n8n did not return a valid jobId.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ jobId });
  } catch (err) {
    console.error("Error in /api/generate-video:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}



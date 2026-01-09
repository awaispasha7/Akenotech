import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    // Check authentication
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to analyze videos." },
        { status: 401 }
      );
    }

    // Verify user exists in Firestore
    const userDoc = await getAdminDb().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    // Forward to Python backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    const backendRes = await fetch(`${backendUrl}/api/videos/upload`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!backendRes.ok) {
      const error = await backendRes.json().catch(() => ({ detail: 'Backend error' }));
      return NextResponse.json(
        { error: error.detail || error.error || 'Upload failed' },
        { status: backendRes.status }
      );
    }

    const result = await backendRes.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in /api/football/upload:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Unexpected server error.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { hasCredits, useCredit } from "@/lib/creditServiceAdmin";
import { getAdminDb } from "@/lib/firebaseAdmin";

// Configure route for large file uploads
export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    console.log('[Football Upload] Received request');
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    console.log('[Football Upload] File received:', file ? { name: file.name, size: file.size, type: file.type } : 'null');
    console.log('[Football Upload] UserId:', userId);

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

    // Check if user has credits
    const hasCredit = await hasCredits(userId);
    if (!hasCredit) {
      return NextResponse.json(
        { error: "You have no credits remaining. Please contact support to add more credits." },
        { status: 403 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    // Use a credit before processing
    const creditUsed = await useCredit(userId);
    if (!creditUsed) {
      return NextResponse.json(
        { error: "Failed to use credit. Please try again." },
        { status: 500 }
      );
    }

    // Forward to Python backend
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const backendFormData = new FormData();
    
    // Convert File to Blob for proper forwarding
    // Read file as array buffer to ensure proper streaming
    const fileBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: file.type });
    backendFormData.append('file', fileBlob, file.name);

    console.log(`[Football Upload] Forwarding file to backend: ${file.name}, size: ${file.size} bytes`);

    const backendRes = await fetch(`${backendUrl}/api/videos/upload`, {
      method: 'POST',
      body: backendFormData,
      // Don't set timeout here - let the backend handle it
      // The timeout is handled by the XMLHttpRequest on the frontend
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
    
    // Check for specific error types
    if (err instanceof Error) {
      if (err.name === 'AbortError' || errorMessage.includes('timeout')) {
        return NextResponse.json(
          { error: "Upload timeout. The file may be too large or the server is taking too long to respond." },
          { status: 504 }
        );
      }
      if (errorMessage.includes('ECONNRESET') || errorMessage.includes('connection reset')) {
        return NextResponse.json(
          { error: "Connection was reset. Please try again with a smaller file or check your internet connection." },
          { status: 502 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Unexpected server error.",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

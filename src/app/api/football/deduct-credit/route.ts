import { NextRequest, NextResponse } from "next/server";
import { hasCredits, useCredit } from "@/lib/creditServiceAdmin";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

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

    // Use a credit before processing
    const creditUsed = await useCredit(userId);
    if (!creditUsed) {
      return NextResponse.json(
        { error: "Failed to use credit. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Credit deducted successfully" });
  } catch (err) {
    console.error("Error in /api/football/deduct-credit:", err);
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

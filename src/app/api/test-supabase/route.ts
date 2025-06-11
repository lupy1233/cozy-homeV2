import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log("Testing Supabase connection...");

    // Test basic connection
    const { data, error, status, statusText } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    console.log("Supabase response:", { data, error, status, statusText });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
          status,
          statusText,
        },
        { status: 500 }
      );
    }

    // Test homes table
    const { data: homesData, error: homesError } = await supabase
      .from("homes")
      .select("id")
      .limit(1);

    console.log("Homes table test:", { homesData, homesError });

    return NextResponse.json({
      success: true,
      connectionTest: "✅ Connected to Supabase",
      profilesTable: data
        ? "✅ Profiles table accessible"
        : "⚠️ Profiles table empty",
      homesTable: homesError
        ? `❌ Homes table error: ${homesError.message}`
        : "✅ Homes table accessible",
      homesError: homesError
        ? {
            message: homesError.message,
            details: homesError.details,
            hint: homesError.hint,
            code: homesError.code,
          }
        : null,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
  } catch (error) {
    console.error("Test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

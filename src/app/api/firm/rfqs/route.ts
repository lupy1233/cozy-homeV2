import { NextRequest, NextResponse } from "next/server";
import { getCurrentFirmSession } from "@/lib/firm-auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getCurrentFirmSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Nu sunteți autentificat" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Get filters
    const search = searchParams.get("search") || "";
    const county = searchParams.get("county") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const budgetMin = searchParams.get("budgetMin")
      ? parseFloat(searchParams.get("budgetMin")!)
      : null;
    const budgetMax = searchParams.get("budgetMax")
      ? parseFloat(searchParams.get("budgetMax")!)
      : null;

    // Use the database function to get RFQs
    const { data: rfqsData, error: rfqsError } = await supabase.rpc(
      "get_firm_rfqs",
      {
        p_firm_id: session.firm.id,
        p_county: county || null,
        p_categories: category ? [category] : null,
        p_budget_min: budgetMin,
        p_budget_max: budgetMax,
        p_status: status || null,
        p_search: search || null,
        p_limit: limit,
        p_offset: offset,
      }
    );

    if (rfqsError) {
      console.error("RFQs fetch error:", rfqsError);
      return NextResponse.json(
        { success: false, error: "Eroare la încărcarea cerințelor" },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("rfqs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .gte("expires_at", new Date().toISOString());

    if (countError) {
      console.error("Count error:", countError);
    }

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      success: true,
      rfqs: rfqsData || [],
      totalPages,
      currentPage: page,
      totalCount: count || 0,
    });
  } catch (error) {
    console.error("RFQs API error:", error);
    return NextResponse.json(
      { success: false, error: "Eroare de server" },
      { status: 500 }
    );
  }
}

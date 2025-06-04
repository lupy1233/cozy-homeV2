import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hashPassword } from "@/lib/firm-auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { firm, ceo } = await request.json();

    // Validate required fields
    const requiredFirmFields = [
      "company_name",
      "company_email",
      "tax_id",
      "county",
      "city",
    ];
    const requiredCeoFields = ["first_name", "last_name", "email", "password"];

    for (const field of requiredFirmFields) {
      if (!firm[field]) {
        return NextResponse.json(
          { success: false, error: `Câmpul ${field} este obligatoriu` },
          { status: 400 }
        );
      }
    }

    for (const field of requiredCeoFields) {
      if (!ceo[field]) {
        return NextResponse.json(
          { success: false, error: `Câmpul ${field} este obligatoriu` },
          { status: 400 }
        );
      }
    }

    if (!firm.specialties || firm.specialties.length === 0) {
      return NextResponse.json(
        { success: false, error: "Selectați cel puțin o specializare" },
        { status: 400 }
      );
    }

    if (ceo.password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Parola trebuie să aibă cel puțin 8 caractere",
        },
        { status: 400 }
      );
    }

    // Check if firm with same tax_id already exists
    const { data: existingFirm } = await supabase
      .from("firms")
      .select("id")
      .eq("tax_id", firm.tax_id)
      .single();

    if (existingFirm) {
      return NextResponse.json(
        { success: false, error: "O firmă cu acest CUI există deja" },
        { status: 400 }
      );
    }

    // Check if CEO email already exists
    const { data: existingCeo } = await supabase
      .from("firm_users")
      .select("id")
      .eq("email", ceo.email)
      .single();

    if (existingCeo) {
      return NextResponse.json(
        { success: false, error: "Un utilizator cu acest email există deja" },
        { status: 400 }
      );
    }

    // Start transaction by creating firm first
    const { data: firmData, error: firmError } = await supabase
      .from("firms")
      .insert({
        company_name: firm.company_name,
        company_description: firm.company_description || null,
        company_website: firm.company_website || null,
        company_address: firm.company_address || null,
        company_phone: firm.company_phone || null,
        company_email: firm.company_email,
        tax_id: firm.tax_id,
        county: firm.county,
        city: firm.city,
        specialties: firm.specialties,
        is_verified: false, // Will be verified manually
        is_active: false, // Will be activated after verification
      })
      .select()
      .single();

    if (firmError) {
      console.error("Firm creation error:", firmError);
      return NextResponse.json(
        { success: false, error: "Eroare la crearea firmei" },
        { status: 500 }
      );
    }

    // Hash CEO password
    const passwordHash = await hashPassword(ceo.password);

    // Create CEO account
    const { error: ceoError } = await supabase.from("firm_users").insert({
      firm_id: firmData.id,
      email: ceo.email,
      password_hash: passwordHash,
      first_name: ceo.first_name,
      last_name: ceo.last_name,
      phone: ceo.phone || null,
      role: "ceo",
      is_active: false, // Will be activated when firm is verified
    });

    if (ceoError) {
      console.error("CEO creation error:", ceoError);

      // Rollback: delete the firm if CEO creation failed
      await supabase.from("firms").delete().eq("id", firmData.id);

      return NextResponse.json(
        { success: false, error: "Eroare la crearea contului CEO" },
        { status: 500 }
      );
    }

    // TODO: Send notification email to admins about new firm registration
    // TODO: Send confirmation email to CEO

    return NextResponse.json({
      success: true,
      message:
        "Înregistrarea a fost realizată cu succes. Veți fi contactat în 24-48 ore.",
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, error: "Eroare de server" },
      { status: 500 }
    );
  }
}

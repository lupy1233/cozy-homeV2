import { NextResponse } from "next/server";
import { logoutFirmUser } from "@/lib/firm-auth";

export async function POST() {
  try {
    await logoutFirmUser();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { success: false, error: "Eroare la deconectare" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { loginFirmUser } from "@/lib/firm-auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email și parola sunt obligatorii" },
        { status: 400 }
      );
    }

    // Attempt login
    const result = await loginFirmUser(email, password);

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.session?.user,
        firm: result.session?.firm,
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Eroare de server" },
      { status: 500 }
    );
  }
}

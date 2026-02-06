import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("[v0] Login attempt for:", email)
    console.log("[v0] NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING")
    console.log("[v0] NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING")

    const supabase = await createClient()
    console.log("[v0] Supabase client created successfully")

    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash, role")
      .eq("email", email)
      .limit(1)

    console.log("[v0] Query result - users:", users?.length, "error:", error?.message || "none")

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json(
        { error: "Server error" },
        { status: 500 }
      )
    }

    const admin = users?.[0]

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password - SHA256 hash using UTF8 encoding to match PostgreSQL
    const passwordHash = crypto
      .createHash("sha256")
      .update(Buffer.from(password, "utf8"))
      .digest("hex")

    if (passwordHash !== admin.password_hash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate session token
    const token = crypto.randomBytes(32).toString("hex")

    // Set HTTP-only cookie for session
    const response = NextResponse.json({
      success: true,
      id: admin.id,
      email: admin.email,
      role: admin.role,
    })

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    response.cookies.set("admin_email", admin.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

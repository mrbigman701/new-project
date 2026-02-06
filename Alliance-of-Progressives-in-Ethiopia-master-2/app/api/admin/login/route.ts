import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("Missing Supabase env vars")
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const supabase = getSupabase()

    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash, role")
      .eq("email", email)
      .limit(1)

    if (error) {
      console.error("Database error:", error)
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

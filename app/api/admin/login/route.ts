import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Use Web Crypto API (works in both Edge and Node runtimes)
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

function generateToken(): string {
  const array = new Uint8Array(32)
  globalThis.crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.log("[v0] SUPABASE_URL:", url ? "SET" : "MISSING")
    console.log("[v0] SUPABASE_ANON_KEY:", key ? "SET" : "MISSING")
    throw new Error("Missing Supabase env vars")
  }
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    let supabase
    try {
      supabase = getSupabase()
    } catch (e) {
      console.log("[v0] Supabase client creation failed:", (e as Error).message)
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash, role")
      .eq("email", email)
      .limit(1)

    if (error) {
      console.log("[v0] Database query error:", error.message)
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

    // Verify password using Web Crypto SHA256 (matches PostgreSQL encode(sha256(convert_to(..., 'UTF8')), 'hex'))
    const passwordHash = await sha256(password)
    console.log("[v0] Computed hash:", passwordHash)
    console.log("[v0] Stored hash:", admin.password_hash)
    console.log("[v0] Match:", passwordHash === admin.password_hash)

    if (passwordHash !== admin.password_hash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate session token
    const token = generateToken()

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
      maxAge: 60 * 60 * 24,
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
    console.log("[v0] Login catch error:", (error as Error).message)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

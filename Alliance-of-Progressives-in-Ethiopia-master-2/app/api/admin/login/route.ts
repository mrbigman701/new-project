import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get the Supabase URL and key from environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log('[v0] Login API - Checking env vars')
    console.log('[v0] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
    console.log('[v0] SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'SET' : 'MISSING')

    if (!supabaseUrl || !supabaseKey) {
      console.error('[v0] Missing Supabase environment variables')
      console.error('[v0] Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')))
      return NextResponse.json(
        { error: 'Server configuration error - Missing Supabase credentials. Please check environment variables.' },
        { status: 500 }
      )
    }

    // Query the admin_users table
    const response = await fetch(`${supabaseUrl}/rest/v1/admin_users?email=eq.${encodeURIComponent(email)}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const users = await response.json()
    const admin = users[0]

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password hash
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')

    if (passwordHash !== admin.password_hash) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate a simple token
    const token = crypto.randomBytes(32).toString('hex')

    return NextResponse.json(
      {
        success: true,
        id: admin.id,
        email: admin.email,
        token: token,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

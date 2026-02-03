import { createClient } from '@/lib/supabase/server'
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

    const supabase = await createClient()

    // Get admin user
    const { data: admin, error: queryError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single()

    if (queryError || !admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password (simple hash comparison - in production use bcrypt)
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

    // Generate a simple token (in production use JWT)
    const token = crypto.randomBytes(32).toString('hex')

    // Return success
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

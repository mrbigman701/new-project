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

    // Query the admin_users table
    const { data: users, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
      )
    }

    const admin = users?.[0]

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

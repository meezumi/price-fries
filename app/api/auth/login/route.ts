import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import VerificationToken from '@/lib/models/verificationToken.model';
import { comparePassword, generateToken } from '@/lib/auth';
import { RATE_LIMIT } from '@/lib/constants';
import { rateLimitMiddleware, getRateLimitKey, checkRateLimit } from '@/lib/rateLimiter';

export async function POST(request: NextRequest) {
  // Rate limiting for auth
  const key = getRateLimitKey(request);
  const { allowed } = checkRateLimit(key, RATE_LIMIT.AUTH);
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    await connectToDB();
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if verified
    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken(user.email);

    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          email: user.email,
          isVerified: user.isVerified
        }
      },
      { status: 200 }
    );

    // Set token in httpOnly cookie for better security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import VerificationToken from '@/lib/models/verificationToken.model';
import { hashPassword, validateEmail, validatePassword, generateVerificationToken } from '@/lib/auth';
import { sendEmail, generateEmailBody } from '@/lib/nodemailer';
import { EMAIL, RATE_LIMIT } from '@/lib/constants';
import { rateLimitMiddleware, getRateLimitKey, checkRateLimit } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Rate limiting for auth
  const key = getRateLimitKey(request);
  const { allowed } = checkRateLimit(key, RATE_LIMIT.AUTH);
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    await connectToDB();
    const { email, password, confirmPassword } = await request.json();

    // Validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      trackedProducts: []
    });

    await user.save();

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + EMAIL.VERIFICATION_EXPIRY);

    await VerificationToken.create({
      email: email.toLowerCase(),
      token: verificationToken,
      expiresAt
    });

    // Send verification email
    const verificationLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    const emailContent = {
      subject: 'Verify your PriceFries account',
      body: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to PriceFries!</h2>
          <p>Click the link below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #14b8a6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy this link: ${verificationLink}</p>
          <p>This link expires in 24 hours.</p>
        </div>
      `
    };

    await sendEmail(emailContent, [email.toLowerCase()]);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Registration successful! Please check your email to verify your account.' 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check if it's an email sending error
    if (error.message && error.message.includes('Email')) {
      return NextResponse.json(
        { error: `${error.message}. Please contact support if this persists.` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

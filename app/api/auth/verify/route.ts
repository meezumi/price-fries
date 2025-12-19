import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import VerificationToken from '@/lib/models/verificationToken.model';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Invalid verification link' },
        { status: 400 }
      );
    }

    // Find and verify token
    const verificationRecord = await VerificationToken.findOne({ 
      token,
      email: email.toLowerCase()
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired verification link' },
        { status: 400 }
      );
    }

    if (verificationRecord.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ token });
      return NextResponse.json(
        { error: 'Verification link has expired' },
        { status: 400 }
      );
    }

    // Update user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.isVerified = true;
    await user.save();

    // Delete verification token
    await VerificationToken.deleteOne({ token });

    // Redirect to login page with success message
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/login?verified=true`, 303);

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}

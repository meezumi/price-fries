import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // Clear auth token cookie
  response.cookies.set({
    name: 'auth-token',
    value: '',
    httpOnly: true,
    maxAge: 0,
    path: '/'
  });

  return response;
}

import { NextRequest, NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 30; // Max requests per window

export const getRateLimitKey = (req: NextRequest): string => {
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';
  return ip;
};

export const checkRateLimit = (key: string, limit: number = MAX_REQUESTS): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
};

export const rateLimitMiddleware = (limit: number = MAX_REQUESTS) => {
  return (req: NextRequest): NextResponse | null => {
    const key = getRateLimitKey(req);
    const { allowed, remaining } = checkRateLimit(key, limit);

    if (!allowed) {
      return new NextResponse('Too many requests. Please try again later.', { status: 429 });
    }

    return null;
  };
};

import { NextResponse } from 'next/server';
import { getUserSession, verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // 1. Check cookies first
    let payload = await getUserSession();

    // 2. Fallback check for authorization bearer header (useful for REST clients / persistent storage)
    if (!payload) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        payload = await verifyToken(token);
      }
    }

    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    // Fetch user details from Database to ensure account is active and return current subscription status
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        subscriptionStatus: true,
        createdAt: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: dbUser
    });

  } catch (error: any) {
    console.error("Verify Session Error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}

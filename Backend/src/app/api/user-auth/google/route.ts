import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, USER_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, picture } = body;

    if (!email) {
      return NextResponse.json({ error: "Google Gmail address is required for authentication" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || normalizedEmail.split('@')[0] || 'Google User';

    // Check if user already exists in SQLite database
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    // If new user, create account with a unique 5-digit random number User ID (10000 - 99999)
    if (!user) {
      let randomUserId: number = 10000 + Math.floor(Math.random() * 90000);
      let attempts = 0;
      while (attempts < 10) {
        const existingId = await prisma.user.findUnique({ where: { id: randomUserId } });
        if (!existingId) break;
        randomUserId = 10000 + Math.floor(Math.random() * 90000);
        attempts++;
      }

      // Generate a secure placeholder password hash for Google OAuth users
      const randomSecret = `google_${Math.random()}_${Date.now()}`;
      const passwordHash = await bcrypt.hash(randomSecret, 10);

      user = await prisma.user.create({
        data: {
          id: randomUserId,
          name: displayName,
          email: normalizedEmail,
          passwordHash,
          role: 'STUDENT',
          subscriptionStatus: 'ACTIVE'
        }
      });
    }

    // Sign JWT token with 5-digit random User ID
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: USER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: "Google Authentication successful in Database",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "An error occurred during Google authentication. Please try again." }, { status: 500 });
  }
}

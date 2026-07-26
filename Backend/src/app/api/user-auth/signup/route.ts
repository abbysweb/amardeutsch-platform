import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, USER_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in the SQLite DB
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email address is already registered" }, { status: 400 });
    }

    // Generate a unique 5-digit random number User ID (between 10000 and 99999) to track user behavior
    let randomUserId: number = 10000 + Math.floor(Math.random() * 90000);
    let attempts = 0;
    while (attempts < 10) {
      const existingId = await prisma.user.findUnique({ where: { id: randomUserId } });
      if (!existingId) break;
      randomUserId = 10000 + Math.floor(Math.random() * 90000);
      attempts++;
    }

    // Hash password & insert user into Database as STUDENT with explicit 5-digit User ID
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        id: randomUserId,
        name: name?.trim() || 'Student Learner',
        email: normalizedEmail,
        passwordHash,
        role: 'STUDENT',
        subscriptionStatus: 'ACTIVE'
      }
    });

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
      message: "Student account registered successfully in Database",
      token, // return token for client fallback persistence if needed
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("User Signup Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during student signup. Please try again." }, { status: 500 });
  }
}

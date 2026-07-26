import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email address is already registered" }, { status: 400 });
    }

    // Generate unique 5-digit random number User ID (between 10000 and 99999)
    let randomUserId: number = 10000 + Math.floor(Math.random() * 90000);
    let attempts = 0;
    while (attempts < 10) {
      const existingId = await prisma.user.findUnique({ where: { id: randomUserId } });
      if (!existingId) break;
      randomUserId = 10000 + Math.floor(Math.random() * 90000);
      attempts++;
    }

    // Hash password & create user with explicit 5-digit random ID
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        id: randomUserId,
        name: name?.trim() || 'Admin User',
        email: normalizedEmail,
        passwordHash,
        role: 'ADMIN'
      }
    });

    // Sign JWT and set HTTP-only cookie with 5-digit ID
    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: `Signup failed: ${error?.message || error || "An unexpected error occurred during signup."}` }, { status: 500 });
  }
}

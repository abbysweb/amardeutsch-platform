import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { USER_COOKIE_NAME, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(USER_COOKIE_NAME);
    cookieStore.delete(ADMIN_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error: any) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}

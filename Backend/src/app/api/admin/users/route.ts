import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscription: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Omit sensitive password hashes before responding to clients
    const safeUsers = (users as any[]).map((user: any) => {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    });

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, role, password, subscriptionId, subscriptionStatus } = body;
    
    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Hash user provided password or generate a random fallback secure string
    const targetPassword = password && password.length >= 6 ? password : Math.random().toString(36).slice(-10) + '!A1';
    const passwordHash = await bcrypt.hash(targetPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || null,
        passwordHash,
        role: role || "STUDENT",
        subscriptionId: subscriptionId ? parseInt(subscriptionId.toString()) : null,
        subscriptionStatus: subscriptionStatus || "INACTIVE"
      },
      include: {
        subscription: true
      }
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user. An account with this email might already exist." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Handle Bulk Operations
    if (Array.isArray(body.ids) && body.ids.length > 0) {
      const parsedIds = body.ids.map((id: any) => parseInt(id.toString()));
      const updateData: Record<string, any> = {};
      if (body.role) updateData.role = body.role;
      if (body.subscriptionStatus) updateData.subscriptionStatus = body.subscriptionStatus;

      const updatedCount = await prisma.user.updateMany({
        where: { id: { in: parsedIds } },
        data: updateData
      });

      return NextResponse.json({ success: true, count: updatedCount.count, message: `Updated ${updatedCount.count} users in bulk.` });
    }

    // Handle Single User Update / Password Reset
    const { id, email, name, role, password, newPassword, subscriptionId, subscriptionStatus } = body;
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      email: email?.toLowerCase().trim(),
      name: name?.trim(),
      role,
      subscriptionId: subscriptionId ? parseInt(subscriptionId.toString()) : null,
      subscriptionStatus
    };

    // If admin is updating or resetting the password
    const targetPassword = newPassword || password;
    if (targetPassword && targetPassword.trim().length >= 6) {
      updateData.passwordHash = await bcrypt.hash(targetPassword.trim(), 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id.toString()) },
      data: updateData,
      include: {
        subscription: true
      }
    });
    
    const { passwordHash: _, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    
    // Support Bulk Deletions
    if (ids) {
      const idArray = ids.split(',').map((item: string) => parseInt(item.trim())).filter((num: number) => !isNaN(num));
      if (idArray.length > 0) {
        const deleted = await prisma.user.deleteMany({
          where: { id: { in: idArray } }
        });
        return NextResponse.json({ success: true, deletedCount: deleted.count });
      }
    }

    if (!id) {
      return NextResponse.json({ error: "User ID or IDs parameter required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user account." }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { price: 'asc' }
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, currency, interval, features, isActive } = body;
    
    const newPlan = await prisma.subscriptionPlan.create({
      data: {
        name,
        price: parseFloat(price),
        currency: currency || "EUR",
        interval: interval || "MONTHLY",
        features: JSON.stringify(features || []),
        isActive: isActive !== undefined ? isActive : true
      }
    });
    
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, price, currency, interval, features, isActive } = body;
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        currency,
        interval,
        features: JSON.stringify(features),
        isActive
      }
    });
    
    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Error updating subscription plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.subscriptionPlan.delete({
      where: { id: parseInt(id) }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscription plan:", error);
    return NextResponse.json({ error: "Failed to delete plan. It might be assigned to users." }, { status: 500 });
  }
}

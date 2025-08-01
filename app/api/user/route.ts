import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        studentId: true,
        department: true,
        preferredContactMode: true,
        contactInfo: true,
        bio: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      studentId,
      department,
      preferredContactMode,
      contactInfo,
      bio,
      image,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (
      (preferredContactMode === "whatsapp" || preferredContactMode === "messenger") &&
      (!contactInfo || contactInfo.trim() === "")
    ) {
      return NextResponse.json(
        { error: "Contact info is required for WhatsApp or Messenger" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        studentId,
        department,
        preferredContactMode,
        contactInfo: preferredContactMode === "email" ? null : contactInfo,
        bio,
        image,
      },
    });

    return NextResponse.json({ message: "Profile completed", user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to complete profile", details: (error as Error).message },
      { status: 500 }
    );
  }
}

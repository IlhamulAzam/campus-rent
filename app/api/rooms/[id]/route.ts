import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const awaitedParams = await Promise.resolve(params);
    const id = Number(awaitedParams.id);

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the room and verify ownership
    const room = await prisma.room.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (room.user.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Failed to delete room:", error);
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const awaitedParams = await Promise.resolve(params);
  const id = Number(awaitedParams.id);

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          studentId: true,
          department: true,
          preferredContactMode: true,
          contactInfo: true,
          bio: true,
        },
      },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (room.features && typeof room.features === "string") {
    room.features = JSON.parse(room.features);
  }

  if (room.photos && typeof room.photos === "string") {
    room.photos = JSON.parse(room.photos);
  }

  return NextResponse.json(room);
}

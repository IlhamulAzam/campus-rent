import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const my = searchParams.get("my");

    if (my === "true") {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const myRooms = await prisma.room.findMany({
        where: { userId: user.id },
      });

      const parsedMyRooms = myRooms.map((room) => ({
        ...room,
        photos: Array.isArray(room.photos) ? room.photos : [],
        features: Array.isArray(room.features) ? room.features : [],
      }));

      return NextResponse.json(parsedMyRooms);
    }

    const rooms = await prisma.room.findMany();
    const parsedRooms = rooms.map((room) => ({
      ...room,
      photos: Array.isArray(room.photos) ? room.photos : [],
      features: Array.isArray(room.features) ? room.features : [],
    }));

    return NextResponse.json(parsedRooms);
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      location,
      price,
      walkTime,
      availableFrom,
      roomType,
      department,
      features,
      mapLink,
      photos,
    } = body;

    const newRoom = await prisma.room.create({
      data: {
        title,
        location,
        price,
        walkTime,
        availableFrom: availableFrom ? new Date(availableFrom) : null,
        roomType,
        department,
        features: features || [],
        mapLink,
        photos: photos || [],
        
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        ...newRoom,
        features: features || [],
        photos: photos || [],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create room:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

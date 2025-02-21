import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Invalid id provided" }, { status: 400 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    if (link.active) {
      return NextResponse.json(
        { error: "Link is already active" },
        { status: 400 }
      );
    }

    await prisma.link.updateMany({
      where: { active: true },
      data: { active: false },
    });

    const updatedLink = await prisma.link.update({
      where: { id },
      data: { active: true },
    });

    return NextResponse.json(updatedLink, { status: 200 });
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

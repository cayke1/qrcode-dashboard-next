import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const link = await prisma.link.findUnique({
    where: { id },
  });
  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  if (link.active) {
    const newActive = await prisma.link.findFirst({
      where: {
        active: false,
      },
    });
    if (newActive) {
      await prisma.link.update({
        where: {
          id: newActive.id,
        },
        data: {
          active: true,
        },
      });
    }
  }
  await prisma.link.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Link deleted successfully" });
}

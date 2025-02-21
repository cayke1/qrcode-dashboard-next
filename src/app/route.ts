import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const link = await prisma.link.findFirstOrThrow({
    where: {
      active: true,
    },
  });
  return NextResponse.redirect(link.url);
}

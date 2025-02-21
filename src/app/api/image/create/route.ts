import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, image } = body;

  const existingLink = await prisma.link.findFirst({
    where: {
      active: true,
    },
  });
  if (existingLink) {
    await prisma.link.update({
      where: {
        id: existingLink.id,
      },
      data: {
        active: false,
      },
    });
  }
  const newLink = await prisma.link.create({
    data: {
      slug: title,
      url: image,
      active: true,
    },
  });
  NextResponse.json(newLink);
}

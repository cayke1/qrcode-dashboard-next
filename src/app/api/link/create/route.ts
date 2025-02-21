import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { title, url } = body;

  await prisma.link.updateMany({
    where: {
      active: true,
    },
    data: {
      active: false,
    },
  });
  const newLink = await prisma.link.create({
    data: {
      id: randomUUID(),
      slug: title,
      url: url,
      active: true,
    },
  });
  NextResponse.json(newLink);
}

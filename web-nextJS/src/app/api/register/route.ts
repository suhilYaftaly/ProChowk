import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/src/libs/prismadb";

export async function POST(request: any) {
  const body = await request.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    console.error("Email already exists");
    throw new Error("Email already exists");
  }

  const hashedPass = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPass },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

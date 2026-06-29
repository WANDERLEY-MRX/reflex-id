import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    id: null,
    email: null,
    name: null,
    avatar: null,
    role: null,
    message: "Use local auth provider for user data",
  });
}

export async function PUT() {
  return NextResponse.json({
    message: "Use local auth provider to update profile",
  });
}

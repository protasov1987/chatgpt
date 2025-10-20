import { NextResponse } from "next/server";
import { users } from "@/data/mockData";

export async function GET() {
  return NextResponse.json(users);
}

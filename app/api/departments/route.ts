import { NextResponse } from "next/server";
import { departments } from "@/data/mockData";

export async function GET() {
  return NextResponse.json(departments);
}

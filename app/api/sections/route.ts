import { NextResponse } from "next/server";
import { sections } from "@/data/mockData";

export async function GET() {
  return NextResponse.json(sections);
}

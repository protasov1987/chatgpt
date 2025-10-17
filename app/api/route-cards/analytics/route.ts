import { NextResponse } from "next/server";
import { getAnalytics } from "@/data/mockData";

export async function GET() {
  return NextResponse.json(getAnalytics());
}

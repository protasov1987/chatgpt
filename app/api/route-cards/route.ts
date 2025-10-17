import { NextRequest, NextResponse } from "next/server";
import { addRouteCard, resetSequences, routeCards } from "@/data/mockData";

export async function GET() {
  return NextResponse.json(routeCards);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const card = addRouteCard({
    ...body,
    scheduled: false
  });
  resetSequences();
  return NextResponse.json(card, { status: 201 });
}

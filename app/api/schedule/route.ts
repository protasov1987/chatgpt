import { NextRequest, NextResponse } from "next/server";
import { planRouteCard, scheduleItems } from "@/data/mockData";

export async function GET() {
  return NextResponse.json(scheduleItems);
}

export async function POST(request: NextRequest) {
  const { id, items } = await request.json();
  planRouteCard(
    id,
    items.map((item: { stepId: number; sectionId: number; startDateTime: string; endDateTime: string }) => ({
      stepId: item.stepId,
      sectionId: item.sectionId,
      start: new Date(item.startDateTime),
      end: new Date(item.endDateTime)
    }))
  );
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { addOperation, operations, resetSequences } from "@/data/mockData";

export async function GET() {
  return NextResponse.json(operations);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newOperation = addOperation(body);
  resetSequences();
  return NextResponse.json(newOperation, { status: 201 });
}

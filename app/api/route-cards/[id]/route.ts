import { NextRequest, NextResponse } from "next/server";
import { updateRouteCardStatus } from "@/data/mockData";

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = Number(params.id);
  const body = await request.json();
  const card = updateRouteCardStatus(id, body.status, body.scheduled);
  if (!card) {
    return NextResponse.json({ message: "Маршрутная карта не найдена" }, { status: 404 });
  }
  return NextResponse.json(card);
}

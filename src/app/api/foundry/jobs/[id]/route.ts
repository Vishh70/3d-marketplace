import { NextResponse } from "next/server";
import { getFoundryJobSnapshot } from "@/lib/foundry";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = await getFoundryJobSnapshot(id);

  if (!job) {
    return NextResponse.json({ message: "Foundry job not found." }, { status: 404 });
  }

  return NextResponse.json(job);
}

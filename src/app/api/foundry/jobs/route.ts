import { NextResponse } from "next/server";
import { createFoundryJob, type FoundryInputView, type FoundryViewLabel } from "@/lib/foundry";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const notes = formData.get("notes");
    const viewLabels: FoundryViewLabel[] = ["front", "side", "back", "top"];
    const views: FoundryInputView[] = viewLabels
      .map((label) => {
        const file = formData.get(label);
        return file instanceof File ? { label, file } : null;
      })
      .filter((view): view is FoundryInputView => Boolean(view));

    if (!views.length) {
      return NextResponse.json({ message: "Please upload at least one image view." }, { status: 400 });
    }

    const job = await createFoundryJob({
      views,
      notes: typeof notes === "string" ? notes : null,
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Foundry job creation error:", error);
    return NextResponse.json({ message: "Unable to start foundry job." }, { status: 500 });
  }
}

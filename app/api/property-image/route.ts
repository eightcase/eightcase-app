import { NextResponse } from "next/server";
import { resolvePropertyImageContext } from "@/lib/property-image/resolve";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.trim();

  if (!address) {
    return NextResponse.json({ error: "address query parameter required" }, { status: 400 });
  }

  try {
    const context = await resolvePropertyImageContext(address);
    return NextResponse.json(context);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Property image resolve failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

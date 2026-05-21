import { NextResponse } from "next/server";
import { isRealAiTransformationEnabledServer } from "@/lib/ai-transformation/config";
import { runServerTransformationPipeline } from "@/lib/ai-transformation/run-server-pipeline";

/** Replicate flux-fill can take 30–90s */
export const maxDuration = 120;
import { analyzePropertyMock } from "@/lib/property-analysis/mock-analyzer";
import { resolvePropertyImageContext } from "@/lib/property-image/resolve";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";

/**
 * POST /api/ai-transformation
 * Server-side transformation entry (for future cron/webhook polling).
 * Not called automatically from funnel while ENABLE_REAL_AI_VISUALIZATION=false.
 */
export async function POST(request: Request) {
  if (!isRealAiTransformationEnabledServer()) {
    return NextResponse.json(
      {
        enabled: false,
        message: "Real AI visualization is disabled (ENABLE_REAL_AI_VISUALIZATION=false).",
      },
      { status: 403 },
    );
  }

  let body: {
    address?: string;
    style?: PoolStyle;
    size?: PoolSize;
    features?: string[];
    leadId?: string;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const address = body.address?.trim();
  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  const style = body.style ?? "Modern";
  const size = body.size ?? "Mellan";
  const features = body.features ?? [];

  const propertyImage = await resolvePropertyImageContext(address);
  const propertyAnalysis = analyzePropertyMock({
    address,
    propertyImage,
    style,
    size,
  });

  const { job, result, realAiEnabled } = await runServerTransformationPipeline({
    address,
    propertyImage,
    propertyAnalysis,
    style,
    size,
    features,
    leadId: body.leadId,
    providerId: "replicate",
  });

  return NextResponse.json({
    enabled: realAiEnabled,
    realAiEnabled,
    job,
    result,
  });
}

export async function GET() {
  return NextResponse.json({
    enabled: isRealAiTransformationEnabledServer(),
    realAiEnabled: isRealAiTransformationEnabledServer(),
    clientHint: process.env.NEXT_PUBLIC_ENABLE_REAL_AI_VISUALIZATION === "true",
    provider: process.env.AI_TRANSFORMATION_PROVIDER ?? "mock",
    replicateConfigured: Boolean(process.env.REPLICATE_API_TOKEN?.trim()),
    model: process.env.REPLICATE_MODEL ?? "black-forest-labs/flux-fill-dev",
  });
}

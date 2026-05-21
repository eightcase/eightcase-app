import sharp from "sharp";
import type { SuggestedPoolPlacement } from "@/lib/property-analysis/types";

export type PreparedImagePair = {
  imageBuffer: Buffer;
  maskBuffer: Buffer;
  width: number;
  height: number;
};

const MAX_EDGE = 1024;

/**
 * Fetch satellite photo and build inpaint mask (black = keep, white = edit).
 */
export async function prepareImageAndMask(input: {
  imageUrl: string;
  placement: SuggestedPoolPlacement;
}): Promise<PreparedImagePair> {
  const response = await fetch(input.imageUrl);
  if (!response.ok) {
    throw new Error(`Could not fetch property image (${response.status})`);
  }

  const raw = Buffer.from(await response.arrayBuffer());
  const image = sharp(raw).rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  const imageBuffer = await image.jpeg({ quality: 92 }).toBuffer();
  const meta = await sharp(imageBuffer).metadata();
  const width = meta.width ?? MAX_EDGE;
  const height = meta.height ?? MAX_EDGE;

  const left = Math.round((input.placement.xPct / 100) * width);
  const top = Math.round((input.placement.yPct / 100) * height);
  const rectW = Math.max(
    24,
    Math.round((input.placement.widthPct / 100) * width),
  );
  const rectH = Math.max(
    20,
    Math.round((input.placement.heightPct / 100) * height),
  );
  const clampedLeft = Math.min(Math.max(0, left), width - rectW);
  const clampedTop = Math.min(Math.max(0, top), height - rectH);

  const whiteRect = await sharp({
    create: {
      width: rectW,
      height: rectH,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .png()
    .toBuffer();

  const maskBuffer = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .composite([{ input: whiteRect, left: clampedLeft, top: clampedTop }])
    .png()
    .toBuffer();

  return { imageBuffer, maskBuffer, width, height };
}

export function bufferToDataUri(buffer: Buffer, mime: string): string {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

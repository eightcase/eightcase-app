import { visualizationPagePath } from "@/lib/visualization/state";

export type VisualizationReadyEmailInput = {
  to: string;
  recipientName?: string | null;
  address: string;
  leadId: string;
  previewImageUrl?: string | null;
};

export type EmailSendResult = {
  success: boolean;
  provider: "mock" | "resend";
  message: string;
  sentAt: string | null;
};

/**
 * Production-ready shape for Resend (or similar).
 * Set RESEND_API_KEY + EMAIL_FROM in env to enable real sends later.
 */
export function buildVisualizationReadyEmail(
  input: VisualizationReadyEmailInput,
): {
  subject: string;
  html: string;
  text: string;
} {
  const name = input.recipientName?.trim() || "där";
  const url = absoluteVisualizationUrl(input.leadId);
  const preview = input.previewImageUrl ?? "/brand/eightcase-symbol.svg";

  const subject = "Din poolvisualisering är redo";
  const text = [
    `Hej ${name}!`,
    "",
    "Din poolvisualisering är redo.",
    "",
    `Öppna min visualisering: ${url}`,
    "",
    "Du kan när som helst återvända och justera storlek, stil och tillval.",
    "",
    `Visualisering för: ${input.address}`,
  ].join("\n");

  const html = `
    <div style="font-family:Georgia,serif;color:#2d2a26;max-width:560px;margin:0 auto;padding:24px">
      <p style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#5c6d54">Eightcase</p>
      <h1 style="font-size:24px;font-weight:400;margin:16px 0 8px">Din poolvisualisering är redo</h1>
      <p style="color:#6b6560;line-height:1.6">Hej ${escapeHtml(name)} — vi har förberett din visualisering för <strong>${escapeHtml(input.address)}</strong>.</p>
      <img src="${escapeHtml(preview)}" alt="" width="100%" style="max-width:480px;border-radius:12px;margin:20px 0" />
      <p style="margin:24px 0">
        <a href="${escapeHtml(url)}" style="display:inline-block;background:#2d4a3e;color:#f5f0e6;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:15px">
          Öppna min visualisering
        </a>
      </p>
      <p style="color:#6b6560;font-size:14px;line-height:1.6">Du kan när som helst återvända och justera storlek, stil och tillval.</p>
    </div>
  `.trim();

  return { subject, html, text };
}

export async function sendVisualizationReadyEmail(
  input: VisualizationReadyEmailInput,
): Promise<EmailSendResult> {
  const payload = buildVisualizationReadyEmail(input);

  if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    // Scaffold: wire Resend here without adding dependency in demo phase.
    return {
      success: false,
      provider: "resend",
      message: "Resend configured but SDK wiring pending — logged mock send",
      sentAt: null,
    };
  }

  if (typeof window !== "undefined") {
    console.info("[Eightcase mock email]", {
      to: input.to,
      subject: payload.subject,
      leadId: input.leadId,
    });
  }

  return {
    success: true,
    provider: "mock",
    message: `Mock: «${payload.subject}» förberedd till ${input.to}`,
    sentAt: new Date().toISOString(),
  };
}

function absoluteVisualizationUrl(leadId: string): string {
  const path = visualizationPagePath(leadId);
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "https://eightcase-app.vercel.app";
  return `${base.replace(/\/$/, "")}${path}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

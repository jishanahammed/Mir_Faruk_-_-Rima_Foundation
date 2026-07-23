import fs from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { DonationStatementDocument } from "@/components/donor/donation-statement-document";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getAllDonorPaymentHistory } from "@/lib/api/donor-portal-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeFileName(value) {
  return String(value ?? "donation-statement")
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "donation-statement";
}

async function getPublicImageDataUrl(fileName) {
  try {
    const imagePath = path.join(process.cwd(), "public", fileName);
    const imageBuffer = await fs.readFile(imagePath);

    return `data:image/png;base64,${imageBuffer.toString("base64")}`;
  } catch {
    return "";
  }
}

export async function GET() {
  try {
    const user = await getCurrentDonorUser();
    const { donor, items } = await getAllDonorPaymentHistory(user);

    const generatedAt = new Date().toISOString();
    const logoSrc = await getPublicImageDataUrl("logo.png");

    const pdfBuffer = await renderToBuffer(
      <DonationStatementDocument
        donor={donor}
        payments={items}
        generatedAt={generatedAt}
        logoSrc={logoSrc}
      />,
    );

    const fileName = `${safeFileName(donor?.fullName)}-donation-statement.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    return new Response(getApiErrorMessage(error), { status: error.status ?? 502 });
  }
}

import fs from "node:fs/promises";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { PaymentInvoiceDocument } from "@/components/admin/payment-invoice-document";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { getDonorPaymentHistoryById } from "@/lib/api/donor-portal-service";
import { getCurrentDonorUser } from "@/lib/donor-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeId(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function safeFileName(value) {
  return String(value ?? "payment-invoice")
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "payment-invoice";
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

export async function GET(_request, context) {
  const params = await context.params;
  const id = normalizeId(params.id);

  if (!id) {
    return new Response("Invalid payment history id.", { status: 400 });
  }

  try {
    const user = await getCurrentDonorUser();
    const payment = await getDonorPaymentHistoryById(user, id);
    const generatedAt = new Date().toISOString();
    const logoSrc = await getPublicImageDataUrl("logo.png");
    const approvalSealSrc = await getPublicImageDataUrl("ApprovalSeal.png");
    const pdfBuffer = await renderToBuffer(
      <PaymentInvoiceDocument
        payment={payment}
        generatedAt={generatedAt}
        logoSrc={logoSrc}
        approvalSealSrc={approvalSealSrc}
      />,
    );
    const fileName = `${safeFileName(payment.transactionId)}-invoice.pdf`;

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

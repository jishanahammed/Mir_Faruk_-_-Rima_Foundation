"use client";

import { useEffect, useState } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import { BeneficiaryReportDocument } from "@/components/admin/beneficiary-report-document";

function toAbsoluteUrl(value) {
  const raw = String(value ?? "").trim().replace(/\\/g, "/");

  if (!raw) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  return new URL(raw, window.location.origin).toString();
}

function isImageDocument(document) {
  const documentType = String(document.documentType ?? "").toLowerCase();
  const fileName = String(document.originalFileName ?? "").toLowerCase();
  const filePath = String(document.filePath ?? document.fileUrl ?? "").toLowerCase();
  const imageExtensions = ["jpg", "jpeg", "png", "webp"];

  return (
    documentType === "applicantphoto" ||
    documentType === "guarantorphoto" ||
    documentType === "beneficiaryphoto" ||
    String(document.contentType ?? "").toLowerCase().startsWith("image/") ||
    imageExtensions.includes(String(document.extension ?? "").toLowerCase()) ||
    imageExtensions.some((extension) => fileName.endsWith(`.${extension}`)) ||
    imageExtensions.some((extension) => filePath.endsWith(`.${extension}`))
  );
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function toDocumentImageProxyUrl(url) {
  return `/api/admin/document-image?url=${encodeURIComponent(url)}`;
}

async function loadImageAsDataUrl(url) {
  if (!url || url.startsWith("data:")) {
    return url;
  }

  try {
    const response = await fetch(toDocumentImageProxyUrl(url), { credentials: "include" });

    if (!response.ok) {
      return url;
    }

    const blob = await response.blob();
    return blob.type.startsWith("image/") || !blob.type ? await blobToDataUrl(blob) : url;
  } catch {
    return url;
  }
}

async function normalizeReportData(beneficiary) {
  const documents = Array.isArray(beneficiary.documents)
    ? await Promise.all(
        beneficiary.documents.map(async (document) => {
          const fileUrl = toAbsoluteUrl(document.fileUrl);

          return {
            ...document,
            fileUrl: isImageDocument(document) ? await loadImageAsDataUrl(fileUrl) : fileUrl,
          };
        }),
      )
    : [];

  return {
    ...beneficiary,
    documents,
  };
}

export function BeneficiaryReportDownloadButton({ beneficiary }) {
  const [hasMounted, setHasMounted] = useState(false);
  const [logoSrc, setLogoSrc] = useState("");
  const [approvalSealSrc, setApprovalSealSrc] = useState("");
  const [generatedAt, setGeneratedAt] = useState("");
  const [reportBeneficiary, setReportBeneficiary] = useState(beneficiary);

  useEffect(() => {
    let isMounted = true;

    setHasMounted(true);
    setLogoSrc(toAbsoluteUrl("/logo.png"));
    setApprovalSealSrc(toAbsoluteUrl("/ApprovalSeal.png"));
    setGeneratedAt(new Date().toISOString());

    normalizeReportData(beneficiary).then((normalizedBeneficiary) => {
      if (isMounted) {
        setReportBeneficiary(normalizedBeneficiary);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [beneficiary]);

  if (!hasMounted) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-12 cursor-wait items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 text-sm font-semibold text-slate-500"
      >
        Preparing PDF...
      </button>
    );
  }

  const document = (
    <BeneficiaryReportDocument
      beneficiary={reportBeneficiary}
      generatedAt={generatedAt || new Date().toISOString()}
      logoSrc={logoSrc}
      approvalSealSrc={approvalSealSrc}
    />
  );

  return (
    <BlobProvider document={document}>
      {({ url, loading, error }) => (
        <button
          type="button"
          disabled={loading || Boolean(error) || !url}
          onClick={() => {
            if (url) {
              window.open(url, "_blank", "noopener,noreferrer");
            }
          }}
          className={`inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition ${
            loading || error
              ? "cursor-wait border border-slate-200 bg-slate-100 text-slate-500"
              : "border border-cyan-200 bg-cyan-50 text-cyan-800 hover:border-cyan-300 hover:bg-cyan-100"
          }`}
        >
          {error ? "PDF unavailable" : loading ? "Preparing PDF..." : "Open PDF Report"}
        </button>
      )}
    </BlobProvider>
  );
}

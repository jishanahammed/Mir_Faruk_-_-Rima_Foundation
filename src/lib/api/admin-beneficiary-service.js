import "server-only";

import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/api-error";
import { apiGetById, apiPost, apiPut } from "@/lib/api/api-service";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export const BENEFICIARY_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 80, 100];
export const BENEFICIARY_STATUS_OPTIONS = [
  "Pending",
  "UnderReview",
  "Approved",
  "Rejected",
];

function pickValue(payload, camelKey, pascalKey, fallback) {
  return payload?.[camelKey] ?? payload?.[pascalKey] ?? fallback;
}

function normalizePageNumber(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function normalizePageSize(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return BENEFICIARY_PAGE_SIZE_OPTIONS.includes(parsed)
    ? parsed
    : BENEFICIARY_PAGE_SIZE_OPTIONS[0];
}

function normalizeSearchText(value) {
  return String(value ?? "").trim();
}

function normalizeStatus(value) {
  const match = BENEFICIARY_STATUS_OPTIONS.find(
    (option) => option.toLowerCase() === String(value ?? "").trim().toLowerCase(),
  );

  return match ?? BENEFICIARY_STATUS_OPTIONS[0];
}

function normalizeBoolean(value) {
  return Boolean(value);
}

function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildAssetUrl(filePath) {
  const rawValue = String(filePath ?? "").trim();

  if (!rawValue) {
    return "";
  }

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  const normalizedPath = rawValue.replace(/\\/g, "/").replace(/^~\//, "").replace(/^\/+/, "");
  const baseUrl = process.env.AUTH_API_BASE_URL;

  if (!baseUrl) {
    return `/${normalizedPath}`;
  }

  try {
    const origin = new URL(baseUrl).origin;
    return new URL(normalizedPath, `${origin}/`).toString();
  } catch {
    return `/${normalizedPath}`;
  }
}

function getDocumentLabel(documentType) {
  const labels = {
    ApplicantNidCopy: "Applicant NID / Birth Certificate",
    ApplicantPhoto: "Applicant Photo",
    AddressProof: "Address Proof",
    IncomeCertificate: "Income Certificate",
    RecommendationLetter: "Recommendation Letter",
    GuarantorNidCopy: "Guarantor NID Copy",
    GuarantorPhoto: "Guarantor Photo",
  };

  return labels[documentType] ?? documentType ?? "Document";
}

function normalizeDocument(payload) {
  if (!payload) {
    return null;
  }

  const filePath = pickValue(payload, "filePath", "FilePath", "");
  const contentType = pickValue(payload, "contentType", "ContentType", "");

  return {
    id: normalizeNumber(pickValue(payload, "id", "Id", 0)),
    documentType: pickValue(payload, "documentType", "DocumentType", ""),
    label: getDocumentLabel(pickValue(payload, "documentType", "DocumentType", "")),
    originalFileName: pickValue(payload, "originalFileName", "OriginalFileName", ""),
    filePath,
    fileUrl: buildAssetUrl(filePath),
    contentType,
    fileSize: normalizeNumber(pickValue(payload, "fileSize", "FileSize", 0)),
    uploadedAt: pickValue(payload, "uploadedAt", "UploadedAt", null),
    extension:
      String(pickValue(payload, "originalFileName", "OriginalFileName", ""))
        .split(".")
        .pop()
        ?.toLowerCase() ?? "",
  };
}

function normalizeBeneficiary(payload) {
  if (!payload) {
    return null;
  }

  return {
    id: pickValue(payload, "id", "Id", 0),
    userId: pickValue(payload, "userId", "UserId", ""),
    fullName: pickValue(payload, "fullName", "FullName", ""),
    nidOrBirthNumber: pickValue(payload, "nidOrBirthNumber", "NidOrBirthNumber", ""),
    mobile: pickValue(payload, "mobile", "Mobile", ""),
    email: pickValue(payload, "email", "Email", ""),
    district: pickValue(payload, "district", "District", ""),
    upazila: pickValue(payload, "upazila", "Upazila", ""),
    assistanceType: pickValue(payload, "assistanceType", "AssistanceType", ""),
    monthlyIncome: normalizeNumber(pickValue(payload, "monthlyIncome", "MonthlyIncome", 0)),
    guarantorName: pickValue(payload, "guarantorName", "GuarantorName", ""),
    status: normalizeStatus(pickValue(payload, "status", "Status", BENEFICIARY_STATUS_OPTIONS[0])),
    documentCount: normalizeNumber(pickValue(payload, "documentCount", "DocumentCount", 0)),
    submittedAt: pickValue(payload, "submittedAt", "SubmittedAt", null),
    createdAt: pickValue(payload, "createdAt", "CreatedAt", null),
    updatedAt: pickValue(payload, "updatedAt", "UpdatedAt", null),
  };
}

function normalizeBeneficiaryDetails(payload) {
  const beneficiary = normalizeBeneficiary(payload);

  if (!beneficiary) {
    return null;
  }

  const documents = pickValue(payload, "documents", "Documents", []);

  return {
    ...beneficiary,
    fatherOrHusbandName: pickValue(payload, "fatherOrHusbandName", "FatherOrHusbandName", ""),
    motherName: pickValue(payload, "motherName", "MotherName", ""),
    dateOfBirth: pickValue(payload, "dateOfBirth", "DateOfBirth", null),
    gender: pickValue(payload, "gender", "Gender", ""),
    presentAddress: pickValue(payload, "presentAddress", "PresentAddress", ""),
    permanentAddress: pickValue(payload, "permanentAddress", "PermanentAddress", ""),
    unionParishadorPourashava: pickValue(
      payload,
      "unionParishadorPourashava",
      "UnionParishadorPourashava",
      "",
    ),
    ward: pickValue(payload, "ward", "Ward", ""),
    unionWard: pickValue(payload, "unionWard", "UnionWard", ""),
    villageArea: pickValue(payload, "villageArea", "VillageArea", ""),
    maritalStatus: pickValue(payload, "maritalStatus", "MaritalStatus", ""),
    familyMembers: normalizeNumber(pickValue(payload, "familyMembers", "FamilyMembers", 0)),
    mainOccupation: pickValue(payload, "mainOccupation", "MainOccupation", ""),
    financialCondition: pickValue(payload, "financialCondition", "FinancialCondition", ""),
    assistanceReason: pickValue(payload, "assistanceReason", "AssistanceReason", ""),
    expectedAssistance: pickValue(payload, "expectedAssistance", "ExpectedAssistance", ""),
    assistancePurpose: pickValue(payload, "assistancePurpose", "AssistancePurpose", ""),
    repaymentCommitment: normalizeBoolean(
      pickValue(payload, "repaymentCommitment", "RepaymentCommitment", false),
    ),
    guarantorFatherOrHusbandName: pickValue(
      payload,
      "guarantorFatherOrHusbandName",
      "GuarantorFatherOrHusbandName",
      "",
    ),
    guarantorNid: pickValue(payload, "guarantorNid", "GuarantorNid", ""),
    guarantorMobile: pickValue(payload, "guarantorMobile", "GuarantorMobile", ""),
    guarantorEmail: pickValue(payload, "guarantorEmail", "GuarantorEmail", ""),
    guarantorOccupation: pickValue(payload, "guarantorOccupation", "GuarantorOccupation", ""),
    guarantorRelation: pickValue(payload, "guarantorRelation", "GuarantorRelation", ""),
    guarantorPresentAddress: pickValue(
      payload,
      "guarantorPresentAddress",
      "GuarantorPresentAddress",
      "",
    ),
    guarantorPermanentAddress: pickValue(
      payload,
      "guarantorPermanentAddress",
      "GuarantorPermanentAddress",
      "",
    ),
    guarantorDistrict: pickValue(payload, "guarantorDistrict", "GuarantorDistrict", ""),
    guarantorUpazila: pickValue(payload, "guarantorUpazila", "GuarantorUpazila", ""),
    knownDuration: pickValue(payload, "knownDuration", "KnownDuration", ""),
    confirmsInfo: pickValue(payload, "confirmsInfo", "ConfirmsInfo", ""),
    supportsVerification: pickValue(payload, "supportsVerification", "SupportsVerification", ""),
    guarantorComment: pickValue(payload, "guarantorComment", "GuarantorComment", ""),
    termsAccepted: normalizeBoolean(pickValue(payload, "termsAccepted", "TermsAccepted", false)),
    truthConfirmed: normalizeBoolean(pickValue(payload, "truthConfirmed", "TruthConfirmed", false)),
    guarantorKnownConfirmed: normalizeBoolean(
      pickValue(payload, "guarantorKnownConfirmed", "GuarantorKnownConfirmed", false),
    ),
    guarantorCooperationConfirmed: normalizeBoolean(
      pickValue(payload, "guarantorCooperationConfirmed", "GuarantorCooperationConfirmed", false),
    ),
    digitalSignatureConfirmed: normalizeBoolean(
      pickValue(payload, "digitalSignatureConfirmed", "DigitalSignatureConfirmed", false),
    ),
    acceptedAt: pickValue(payload, "acceptedAt", "AcceptedAt", null),
    documents: Array.isArray(documents)
      ? documents.map(normalizeDocument).filter(Boolean)
      : [],
  };
}

async function getAdminAuthConfig() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!accessToken) {
    throw new ApiError("Admin session token is missing.");
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export async function getAdminBeneficiaryList(filters = {}) {
  const payload = await apiPost(
    "Beneficiaries/paged",
    {
      PageNumber: normalizePageNumber(filters.page),
      PageSize: normalizePageSize(filters.pageSize),
      SearchText: normalizeSearchText(filters.search) || null,
    },
    await getAdminAuthConfig(),
  );

  const items = pickValue(payload, "items", "Items", []);
  const totalCount = pickValue(payload, "totalCount", "TotalCount", 0);
  const totalPages = pickValue(payload, "totalPages", "TotalPages", 0);
  const pageNumber = pickValue(payload, "pageNumber", "PageNumber", 1);
  const pageSize = pickValue(payload, "pageSize", "PageSize", BENEFICIARY_PAGE_SIZE_OPTIONS[0]);
  const hasNextPage = pickValue(payload, "hasNextPage", "HasNextPage", false);
  const hasPreviousPage = pickValue(payload, "hasPreviousPage", "HasPreviousPage", false);

  return {
    items: Array.isArray(items) ? items.map(normalizeBeneficiary).filter(Boolean) : [],
    totalCount: Number(totalCount) || 0,
    totalPages: Math.max(1, Number(totalPages) || 0),
    pageNumber: normalizePageNumber(pageNumber),
    pageSize: normalizePageSize(pageSize),
    hasNextPage: Boolean(hasNextPage),
    hasPreviousPage: Boolean(hasPreviousPage),
  };
}

export async function getAdminBeneficiaryById(id) {
  return normalizeBeneficiaryDetails(
    await apiGetById("Beneficiaries", id, await getAdminAuthConfig()),
  );
}

export async function getDonorViewBeneficiaryById(id) {
  return normalizeBeneficiaryDetails(
    await apiGetById("Beneficiaries/me-view", id, await getAdminAuthConfig()),
  );
}

export async function updateAdminBeneficiaryStatus(id, status) {
  return normalizeBeneficiary(
    await apiPut(
      `Beneficiaries/${id}/status`,
      { Status: normalizeStatus(status) },
      await getAdminAuthConfig(),
    ),
  );
}

import https from "node:https";
import axios from "axios";
import { ApiError } from "@/lib/api/api-error";

function normalizeBaseUrl(value) {
  if (!value) {
    return "";
  }

  return value.endsWith("/") ? value : `${value}/`;
}

function getTimeoutMs(value, fallback) {
  const parsed = Number(value);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return fallback;
}

const baseURL = normalizeBaseUrl(process.env.AUTH_API_BASE_URL);
const timeout = getTimeoutMs(process.env.AUTH_API_TIMEOUT_MS, 12000);
const donorRegistrationTimeout = getTimeoutMs(
  process.env.AUTH_API_DONOR_REGISTRATION_TIMEOUT_MS,
  30000,
);
const allowSelfSigned = process.env.AUTH_API_ALLOW_SELF_SIGNED === "true";

export const apiTimeouts = {
  default: timeout,
  donorRegistration: donorRegistrationTimeout,
};

export const authApiClient = axios.create({
  baseURL,
  timeout,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  httpsAgent: allowSelfSigned
    ? new https.Agent({ rejectUnauthorized: false })
    : undefined,
});

authApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null;
    const payload = error.response?.data;
    const isTimeout =
      error.code === "ECONNABORTED" || String(error.message ?? "").includes("timeout");
    const message =
      (isTimeout
        ? "The server is taking longer than expected. Please try again in a moment."
        : null) ??
      payload?.message ??
      payload?.title ??
      payload?.error ??
      error.message ??
      "The authentication server is not reachable right now.";

    throw new ApiError(message, {
      status,
      code: error.code,
      details: payload,
    });
  },
);

export function assertApiConfigured() {
  if (!baseURL) {
    throw new ApiError("Authentication API base URL is not configured.");
  }
}

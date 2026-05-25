"use client";

import { ApiError } from "@/lib/api/api-error";

const DEFAULT_TIMEOUT_MS = 30000;

function normalizeEndpoint(endpoint) {
  const value = String(endpoint ?? "").trim();

  if (!value) {
    return "/";
  }

  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) {
    return value;
  }

  const normalizedPath = value
    .replace(/^\/+/, "")
    .replace(/\\/g, "/")
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.toLowerCase())
    .join("/");

  return `/api/${normalizedPath}`;
}

function buildEndpoint(endpoint, id) {
  const path = normalizeEndpoint(endpoint);

  if (id === undefined || id === null || id === "") {
    return path;
  }

  return `${path.replace(/\/+$/, "")}/${encodeURIComponent(id)}`;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  const text = await response.text().catch(() => "");
  return text ? { message: text } : null;
}

async function request(method, endpoint, options = {}) {
  const { id, data, config } = options;
  const controller = new AbortController();
  const timeoutMs = Number(config?.timeout ?? DEFAULT_TIMEOUT_MS);
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildEndpoint(endpoint, id), {
      method: method.toUpperCase(),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(config?.headers ?? {}),
      },
      body: data === undefined ? undefined : JSON.stringify(data),
      credentials: config?.credentials ?? "same-origin",
      signal: config?.signal ?? controller.signal,
    });

    const payload = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(
        payload?.message ??
          payload?.Message ??
          payload?.error ??
          payload?.title ??
          "The request could not be completed right now.",
        {
          status: response.status,
          details: payload,
        },
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error?.name === "AbortError") {
      throw new ApiError("The server is taking longer than expected. Please try again in a moment.", {
        code: "TIMEOUT",
      });
    }

    throw new ApiError(error?.message ?? "Something went wrong. Please try again.");
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export function apiGet(endpoint, config) {
  return request("get", endpoint, { config });
}

export function apiGetById(endpoint, id, config) {
  return request("get", endpoint, { id, config });
}

export function apiPost(endpoint, data, config) {
  return request("post", endpoint, { data, config });
}

export function apiPut(endpoint, data, config) {
  return request("put", endpoint, { data, config });
}

export const get = apiGet;
export const getById = apiGetById;
export const post = apiPost;
export const put = apiPut;

export const api = {
  get: apiGet,
  getById: apiGetById,
  post: apiPost,
  put: apiPut,
};

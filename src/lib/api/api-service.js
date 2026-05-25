import { assertApiConfigured, authApiClient } from "@/lib/api/server-client";

function normalizeEndpoint(endpoint) {
  return String(endpoint ?? "").replace(/^\/+|\/+$/g, "");
}

function buildEndpoint(endpoint, id) {
  const path = normalizeEndpoint(endpoint);

  if (id === undefined || id === null || id === "") {
    return path;
  }

  return `${path}/${encodeURIComponent(id)}`;
}

async function request(method, endpoint, options = {}) {
  assertApiConfigured();

  const { id, data, config } = options;
  const response = await authApiClient.request({
    method,
    url: buildEndpoint(endpoint, id),
    data,
    ...(config ?? {}),
  });

  return response.data ?? null;
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

export function apiDelete(endpoint, id, config) {
  return request("delete", endpoint, { id, config });
}

export const get = apiGet;
export const getById = apiGetById;
export const post = apiPost;
export const put = apiPut;
export const del = apiDelete;

export const api = {
  get: apiGet,
  getById: apiGetById,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};

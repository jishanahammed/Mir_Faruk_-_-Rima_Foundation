import { ApiError } from "@/lib/api/api-error";
import { apiGet, apiGetById, apiPost, apiPut } from "@/lib/api/api-service";

function pickToken(payload) {
  return (
    payload?.token ??
    payload?.accessToken ??
    payload?.jwtToken ??
    payload?.data?.token ??
    payload?.data?.accessToken ??
    payload?.data?.jwtToken ??
    null
  );
}

function pickRefreshToken(payload) {
  return (
    payload?.refreshToken ??
    payload?.data?.refreshToken ??
    null
  );
}

function pickAccessTokenExpiry(payload) {
  return (
    payload?.accessTokenExpiry ??
    payload?.data?.accessTokenExpiry ??
    null
  );
}

function pickUser(payload, email) {
  return (
    payload?.user ??
    payload?.data?.user ?? {
      email,
    }
  );
}

export async function loginWithEmailPassword({ email, password }) {
  const payload = await apiPost("Auth/login", {
    UserName: email,
    Password: password,
  });

  const token = pickToken(payload);

  if (!payload) {
    throw new ApiError("Login failed. Please check your credentials.", {
      details: payload,
    });
  }

  return {
    token,
    accessToken: token,
    refreshToken: pickRefreshToken(payload),
    accessTokenExpiry: pickAccessTokenExpiry(payload),
    user: pickUser(payload, email),
    raw: payload,
  };
}

export async function refreshAccessToken({ userId, refreshToken }) {
  const payload = await apiPost("Auth/refreshtoken", {
    UserId: userId,
    RefreshToken: refreshToken,
  });

  const token = pickToken(payload);

  if (!payload || !token) {
    throw new ApiError("Session refresh failed. Please sign in again.", {
      details: payload,
    });
  }

  return {
    token,
    accessToken: token,
    refreshToken: pickRefreshToken(payload),
    accessTokenExpiry: pickAccessTokenExpiry(payload),
    user: pickUser(payload),
    raw: payload,
  };
}

export async function forgotPassword({ email }) {
  const payload = await apiPost("Auth/forgot-password", { Email: email });

  return {
    message: payload?.message ?? "If an account exists for this email address, a verification code has been sent.",
    raw: payload,
  };
}

export async function resetPassword({ email, otp, newPassword, confirmPassword }) {
  const payload = await apiPost("Auth/reset-password", {
    Email: email,
    Otp: otp,
    NewPassword: newPassword,
    ConfirmPassword: confirmPassword,
  });

  return {
    message: payload?.message ?? "Your password has been reset successfully.",
    raw: payload,
  };
}

export function getAuth(endpoint, config) {
  return apiGet(endpoint, config);
}

export function getAuthById(endpoint, id, config) {
  return apiGetById(endpoint, id, config);
}

export function postAuth(endpoint, data, config) {
  return apiPost(endpoint, data, config);
}

export function putAuth(endpoint, data, config) {
  return apiPut(endpoint, data, config);
}

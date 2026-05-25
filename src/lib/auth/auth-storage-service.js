"use client";

import { ADMIN_STORAGE_KEYS } from "@/lib/admin-auth";

function safeSetItem(key, value) {
  if (value === undefined || value === null) {
    window.localStorage.removeItem(key);
    return;
  }

  window.localStorage.setItem(key, String(value));
}

export function setLoginUserInformation(session) {
  if (!session) {
    return;
  }

  safeSetItem(ADMIN_STORAGE_KEYS.accessToken, session.accessToken);
  safeSetItem(ADMIN_STORAGE_KEYS.refreshToken, session.refreshToken);
  safeSetItem(ADMIN_STORAGE_KEYS.accessTokenExpiry, session.accessTokenExpiry);
  safeSetItem(ADMIN_STORAGE_KEYS.user, JSON.stringify(session.user ?? null));
}

export function getLoginUserInformation() {
  const userValue = window.localStorage.getItem(ADMIN_STORAGE_KEYS.user);

  return {
    accessToken: window.localStorage.getItem(ADMIN_STORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(ADMIN_STORAGE_KEYS.refreshToken),
    accessTokenExpiry: window.localStorage.getItem(
      ADMIN_STORAGE_KEYS.accessTokenExpiry,
    ),
    user: userValue ? JSON.parse(userValue) : null,
  };
}

export function shouldRefreshLoginSession(bufferMilliseconds = 2 * 60 * 1000) {
  const { accessToken, refreshToken, accessTokenExpiry } =
    getLoginUserInformation();

  if (!refreshToken) {
    return false;
  }

  if (!accessToken || !accessTokenExpiry) {
    return true;
  }

  const expiryTime = new Date(accessTokenExpiry).getTime();

  if (Number.isNaN(expiryTime)) {
    return true;
  }

  return expiryTime - Date.now() <= bufferMilliseconds;
}

export function clearLoginUserInformation() {
  Object.values(ADMIN_STORAGE_KEYS).forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

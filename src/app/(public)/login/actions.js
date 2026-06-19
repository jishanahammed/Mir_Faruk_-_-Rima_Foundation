"use server";

import { cookies } from "next/headers";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { loginWithEmailPassword } from "@/lib/api/auth-service";
import {
  ADMIN_REFRESH_TOKEN_COOKIE,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_VALUE,
  ADMIN_TOKEN_EXPIRY_COOKIE,
  ADMIN_USER_COOKIE,
  getUserHomePath,
  normalizeAdminUser,
  serializeAdminUser,
} from "@/lib/admin-auth";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


export async function loginAdmin(_state, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const remember = formData.get("remember") === "on";

  if (!isValidEmail(email)) {
    return { message: "Please enter a valid email address." };
  }



  let authResult;

  try {
    authResult = await loginWithEmailPassword({ email, password });
  } catch (error) {
    return {
      message: getApiErrorMessage(error),
    };
  }

  const cookieStore = await cookies();
  const maxAge = remember ? 60 * 60 * 24 * 14 : 60 * 60 * 8;
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: authResult.token ?? ADMIN_SESSION_VALUE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge,
  });

  if (authResult.refreshToken) {
    cookieStore.set({
      name: ADMIN_REFRESH_TOKEN_COOKIE,
      value: authResult.refreshToken,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (authResult.accessTokenExpiry) {
    cookieStore.set({
      name: ADMIN_TOKEN_EXPIRY_COOKIE,
      value: authResult.accessTokenExpiry,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure,
      maxAge,
    });
  }

  cookieStore.set({
    name: ADMIN_USER_COOKIE,
    value: serializeAdminUser(authResult.user),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge,
  });

  const normalizedUser = normalizeAdminUser(authResult.user);

  return {
    success: true,
    redirectTo: getUserHomePath(normalizedUser),
    session: {
      accessToken: authResult.accessToken ?? authResult.token ?? "",
      refreshToken: authResult.refreshToken ?? "",
      accessTokenExpiry: authResult.accessTokenExpiry ?? "",
      user: authResult.user ?? null,
    },
  };
}

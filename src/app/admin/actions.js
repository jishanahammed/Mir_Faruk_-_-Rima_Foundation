"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiErrorMessage } from "@/lib/api/api-error";
import { refreshAccessToken } from "@/lib/api/auth-service";
import {
  ADMIN_REFRESH_TOKEN_COOKIE,
  ADMIN_SESSION_COOKIE,
  ADMIN_TOKEN_EXPIRY_COOKIE,
  ADMIN_USER_COOKIE,
  parseAdminUser,
  serializeAdminUser,
} from "@/lib/admin-auth";

async function clearAdminCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  cookieStore.delete(ADMIN_REFRESH_TOKEN_COOKIE);
  cookieStore.delete(ADMIN_TOKEN_EXPIRY_COOKIE);
  cookieStore.delete(ADMIN_USER_COOKIE);
}

export async function refreshAdminSession() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;
  const user = parseAdminUser(cookieStore.get(ADMIN_USER_COOKIE)?.value);

  if (!refreshToken || !user.id) {
    return {
      success: false,
      message: "Session refresh information is missing.",
    };
  }

  try {
    const authResult = await refreshAccessToken({
      userId: user.id,
      refreshToken,
    });
    const secure = process.env.NODE_ENV === "production";
    const maxAge = 60 * 60 * 8;

    cookieStore.set({
      name: ADMIN_SESSION_COOKIE,
      value: authResult.accessToken,
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

    return {
      success: true,
      session: {
        accessToken: authResult.accessToken,
        refreshToken: authResult.refreshToken ?? refreshToken,
        accessTokenExpiry: authResult.accessTokenExpiry ?? "",
        user: authResult.user ?? user,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error),
    };
  }
}

export async function clearAdminSession() {
  await clearAdminCookies();
  return { success: true };
}

export async function logoutAdmin() {
  await clearAdminCookies();
  redirect("/login");
}

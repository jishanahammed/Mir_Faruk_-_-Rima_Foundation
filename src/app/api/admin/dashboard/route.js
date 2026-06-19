import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminDashboardData } from "@/lib/api/admin-dashboard-service";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(accessToken)) {
    return NextResponse.json(
      {
        message: "Admin session is required to access dashboard analytics.",
      },
      { status: 401 },
    );
  }

  const dashboard = await getAdminDashboardData();
  return NextResponse.json(dashboard);
}

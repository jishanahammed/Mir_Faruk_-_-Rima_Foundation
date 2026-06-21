import https from "node:https";
import { NextResponse } from "next/server";

const ALLOW_SELF_SIGNED = process.env.AUTH_API_ALLOW_SELF_SIGNED === "true";
const BASE_URL = (process.env.AUTH_API_BASE_URL ?? "")
  .replace(/\/api\/v1\/?$/, "")
  .replace(/\/$/, "");

function fetchAsset(url) {
  return new Promise((resolve, reject) => {
    const options = ALLOW_SELF_SIGNED ? { rejectUnauthorized: false } : {};

    https.get(url, options, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () =>
        resolve({
          status: res.statusCode ?? 200,
          contentType: res.headers["content-type"] ?? "application/octet-stream",
          buffer: Buffer.concat(chunks),
        }),
      );
      res.on("error", reject);
    }).on("error", reject);
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path || /^https?:\/\//i.test(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const normalizedPath = path.replace(/^~\//, "").replace(/^\/+/, "");
  const assetUrl = `${BASE_URL}/${normalizedPath}`;

  try {
    const { status, contentType, buffer } = await fetchAsset(assetUrl);

    if (status < 200 || status >= 300) {
      return NextResponse.json({ error: "Asset not found" }, { status });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 502 });
  }
}

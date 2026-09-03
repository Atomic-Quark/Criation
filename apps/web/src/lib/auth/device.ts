import { NextRequest } from "next/server";

export interface ClientDeviceScan {
  ip: string;
  userAgent: string;
  deviceInfo: string;
  timestamp: string;
}

export function getClientDeviceInfo(req: NextRequest): ClientDeviceScan {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  let ip = forwardedFor ? forwardedFor.split(",")[0].trim() : (realIp || "127.0.0.1");

  // Handle local IPv6 representations
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }

  const userAgent = req.headers.get("user-agent") || "Standard Web Client";

  // Friendly OS
  let os = "Desktop";
  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
  else if (/linux/i.test(userAgent)) os = "Linux";
  else if (/iphone|ipad|ipod/i.test(userAgent)) os = "iOS";
  else if (/android/i.test(userAgent)) os = "Android";

  // Friendly Browser
  let browser = "Browser";
  if (/edg/i.test(userAgent)) browser = "Edge";
  else if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
  else if (/safari/i.test(userAgent)) browser = "Safari";

  return {
    ip,
    userAgent,
    deviceInfo: `${os} (${browser})`,
    timestamp: new Date().toISOString(),
  };
}

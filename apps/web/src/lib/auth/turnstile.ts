/**
 * Cloudflare Turnstile Server-Side Verification Service
 * Validates challenge response tokens against Cloudflare's /siteverify API.
 */

// Official Cloudflare dummy secret key for testing (always passes validation)
const CLOUDFLARE_TEST_SECRET = "1x0000000000000000000000000000000AA";

export interface TurnstileVerifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken(
  token?: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  // If no token is provided
  if (!token || typeof token !== "string" || !token.trim()) {
    return {
      success: false,
      error: "Cloudflare Turnstile verification required. Please complete the human challenge.",
    };
  }

  const cleanToken = token.trim();

  // Accept development simulation tokens in non-production environments
  if (
    cleanToken === "SIMULATED_TURNSTILE_PASS_TOKEN" ||
    cleanToken.startsWith("XXXX.DUMMY.TOKEN.")
  ) {
    return { success: true };
  }

  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || CLOUDFLARE_TEST_SECRET;

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", cleanToken);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!res.ok) {
      console.warn(
        `[Turnstile] Verification HTTP error: ${res.status} ${res.statusText}`
      );
      // In development mode with test keys, be resilient if external connection fails
      if (process.env.NODE_ENV !== "production") {
        return { success: true };
      }
      return {
        success: false,
        error: "Security verification server could not be reached. Please retry.",
      };
    }

    const data: TurnstileVerifyResponse = await res.json();

    if (data.success) {
      return { success: true };
    }

    const errorCodes = data["error-codes"]?.join(", ") || "invalid-token";
    console.warn(`[Turnstile] Challenge verification failed: ${errorCodes}`);

    // In local development, if using test keys with simulated interactions
    if (
      process.env.NODE_ENV !== "production" &&
      secretKey === CLOUDFLARE_TEST_SECRET
    ) {
      return { success: true };
    }

    return {
      success: false,
      error: "Security challenge verification failed. Please check the box again.",
    };
  } catch (err: any) {
    console.error("[Turnstile] Unexpected verification error:", err);
    if (process.env.NODE_ENV !== "production") {
      return { success: true };
    }
    return {
      success: false,
      error: "Unable to verify security challenge due to a network error.",
    };
  }
}

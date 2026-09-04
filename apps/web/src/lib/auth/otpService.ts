import crypto from "crypto";

export interface OtpRecord {
  target: string; // E.164 phone or normalized email
  type: "phone" | "email";
  code: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

// Global in-memory storage for OTP records (persists across requests within worker)
const otpStore = new Map<string, OtpRecord>();

// Verified tokens store: allows registration/profile updates within 15 minutes of verification
const verifiedTokens = new Map<string, { target: string; verifiedAt: number; expiresAt: number }>();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const MAX_VERIFY_ATTEMPTS = 5;

/**
 * Normalizes the lookup key for phone or email
 */
function normalizeKey(target: string): string {
  return target.toLowerCase().trim().replace(/\s+/g, "");
}

/**
 * Issues and sends a 6-digit verification OTP
 */
export function issueOtp(
  target: string,
  type: "phone" | "email"
): { success: boolean; message: string; cooldownRemaining?: number; devCode?: string } {
  const key = normalizeKey(target);
  const now = Date.now();
  const existing = otpStore.get(key);

  // Check cooldown
  if (existing && now - existing.createdAt < RESEND_COOLDOWN_MS) {
    const remainingSec = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${remainingSec} seconds before requesting another verification code.`,
      cooldownRemaining: remainingSec,
    };
  }

  // Generate secure 6-digit random code
  const code = crypto.randomInt(100000, 999999).toString();

  otpStore.set(key, {
    target,
    type,
    code,
    createdAt: now,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    verified: false,
  });

  console.log(`\n======================================================`);
  console.log(`[Criation Security OTP] Target: ${target} (${type.toUpperCase()})`);
  console.log(`[Criation Security OTP] 6-Digit Code: >>> ${code} <<<`);
  console.log(`[Criation Security OTP] Valid for 10 minutes.`);
  console.log(`======================================================\n`);

  return {
    success: true,
    message: `Verification code sent to ${target}. Valid for 10 minutes.`,
    // Expose in local development so the user can test the verification modal immediately
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  };
}

/**
 * Validates a submitted 6-digit OTP code
 */
export function verifyOtp(
  target: string,
  submittedCode: string
): { success: boolean; message: string; verificationToken?: string } {
  const key = normalizeKey(target);
  const record = otpStore.get(key);

  if (!record) {
    return {
      success: false,
      message: "No verification code was requested for this destination or the code has expired.",
    };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return {
      success: false,
      message: "Verification code has expired. Please request a new code.",
    };
  }

  record.attempts += 1;

  if (record.attempts > MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(key);
    return {
      success: false,
      message: "Too many failed attempts. For your security, this code has been invalidated.",
    };
  }

  if (record.code !== submittedCode.trim()) {
    const remaining = MAX_VERIFY_ATTEMPTS - record.attempts;
    return {
      success: false,
      message: `Invalid verification code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // Mark as verified
  record.verified = true;
  otpStore.delete(key); // consume code

  // Create a temporary verification token (valid for 15 mins)
  const token = `vtok_${crypto.randomBytes(24).toString("hex")}`;
  verifiedTokens.set(token, {
    target,
    verifiedAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  return {
    success: true,
    message: "Destination verified successfully! 🎉",
    verificationToken: token,
  };
}

/**
 * Validates whether a given target has a valid verification token
 */
export function consumeVerificationToken(target: string, token?: string): boolean {
  if (!token) return false;
  const entry = verifiedTokens.get(token);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    verifiedTokens.delete(token);
    return false;
  }

  if (normalizeKey(entry.target) !== normalizeKey(target)) {
    return false;
  }

  // Token consumed once
  verifiedTokens.delete(token);
  return true;
}

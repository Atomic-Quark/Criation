/**
 * Strict Email Validation & Disposable Domain Defense
 * Enforces RFC 5322 syntax compliance, domain structure, and blocks known throwaway email providers.
 */

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "tempmail.com",
  "10minutemail.com",
  "mailinator.com",
  "guerrillamail.com",
  "throwawaymail.com",
  "trashmail.com",
  "getairmail.com",
  "yopmail.com",
  "sharklasers.com",
  "dispostable.com",
  "fakeinbox.com",
  "tempinbox.com",
  "maildrop.cc",
  "inboxkitten.com",
  "burnermail.io",
]);

export interface EmailValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  domain: string;
  error?: string;
}

export function validateEmail(rawEmail: string): EmailValidationResult {
  if (!rawEmail || typeof rawEmail !== "string") {
    return {
      isValid: false,
      normalizedEmail: "",
      domain: "",
      error: "Email address is required.",
    };
  }

  const normalized = rawEmail.toLowerCase().trim();

  // 1. Strict RFC 5322 regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(normalized)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      domain: "",
      error: "Please enter a syntactically valid email address (e.g., name@example.com).",
    };
  }

  const parts = normalized.split("@");
  if (parts.length !== 2) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      domain: "",
      error: "Malformed email address structure.",
    };
  }

  const [localPart, domain] = parts;

  // 2. Length constraints
  if (localPart.length > 64) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      domain,
      error: "Email local part cannot exceed 64 characters.",
    };
  }

  if (normalized.length > 254) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      domain,
      error: "Total email length cannot exceed 254 characters.",
    };
  }

  // 3. TLD validation (must be at least 2 alpha characters)
  const domainParts = domain.split(".");
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-z]{2,24}$/.test(tld)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      domain,
      error: "Email domain contains an invalid top-level domain (TLD).",
    };
  }

  // 4. Block known disposable temporary email providers
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      domain,
      error: "Temporary or disposable email domains are not accepted for account security.",
    };
  }

  return {
    isValid: true,
    normalizedEmail: normalized,
    domain,
  };
}

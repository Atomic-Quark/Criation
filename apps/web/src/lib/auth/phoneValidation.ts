/**
 * International Phone Validation Engine
 * Enforces E.164 compliance, country-specific length and prefix rules,
 * and detects garbage/repetitive sequences (e.g., "2455", "0000000000", "1234567890").
 */

export interface CountryTelecomInfo {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
  flag: string;
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  placeholder: string;
  hint: string;
}

export const SUPPORTED_COUNTRIES: CountryTelecomInfo[] = [
  {
    code: "IN",
    name: "India",
    dialCode: "+91",
    flag: "🇮🇳",
    minLength: 10,
    maxLength: 10,
    // Indian mobile numbers must be 10 digits starting with 6, 7, 8, or 9
    pattern: /^[6-9]\d{9}$/,
    placeholder: "98765 43210",
    hint: "10 digits starting with 6, 7, 8, or 9",
  },
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    flag: "🇺🇸",
    minLength: 10,
    maxLength: 10,
    // US numbers: 10 digits, area code 2-9, exchange code 2-9
    pattern: /^[2-9]\d{2}[2-9]\d{6}$/,
    placeholder: "(555) 012-3456",
    hint: "10 digits with valid US area code",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    flag: "🇬🇧",
    minLength: 10,
    maxLength: 11,
    // UK mobile: 7xxx xxxxxx (10 digits without leading 0)
    pattern: /^7\d{9}$/,
    placeholder: "7911 123456",
    hint: "10 digits starting with 7 (omit leading 0)",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    dialCode: "+971",
    flag: "🇦🇪",
    minLength: 9,
    maxLength: 9,
    // UAE mobile: 5x xxx xxxx
    pattern: /^5\d{8}$/,
    placeholder: "50 123 4567",
    hint: "9 digits starting with 5",
  },
  {
    code: "CA",
    name: "Canada",
    dialCode: "+1",
    flag: "🇨🇦",
    minLength: 10,
    maxLength: 10,
    pattern: /^[2-9]\d{2}[2-9]\d{6}$/,
    placeholder: "(416) 555-0199",
    hint: "10 digits with valid Canadian area code",
  },
  {
    code: "AU",
    name: "Australia",
    dialCode: "+61",
    flag: "🇦🇺",
    minLength: 9,
    maxLength: 9,
    // Australian mobile: 4xx xxx xxx
    pattern: /^4\d{8}$/,
    placeholder: "412 345 678",
    hint: "9 digits starting with 4 (omit leading 0)",
  },
  {
    code: "SG",
    name: "Singapore",
    dialCode: "+65",
    flag: "🇸🇬",
    minLength: 8,
    maxLength: 8,
    // Singapore mobile: 8xxx xxxx or 9xxx xxxx
    pattern: /^[89]\d{7}$/,
    placeholder: "9123 4567",
    hint: "8 digits starting with 8 or 9",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    dialCode: "+966",
    flag: "🇸🇦",
    minLength: 9,
    maxLength: 9,
    // KSA mobile: 5x xxx xxxx
    pattern: /^5\d{8}$/,
    placeholder: "50 123 4567",
    hint: "9 digits starting with 5",
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    flag: "🇩🇪",
    minLength: 10,
    maxLength: 11,
    pattern: /^1[5-7]\d{8,9}$/,
    placeholder: "151 23456789",
    hint: "10-11 digits starting with 15/16/17 (omit leading 0)",
  },
];

export interface PhoneValidationResult {
  isValid: boolean;
  countryCode: string;
  dialCode: string;
  nationalNumber: string;
  formattedE164: string;
  displayFormatted: string;
  error?: string;
}

/**
 * Validates a national phone number against country specifications
 * Rejects short sequences (e.g., "2455"), repeated digits, or invalid prefixes.
 */
export function validatePhoneNumber(
  dialCodeInput: string,
  rawNationalNumber: string
): PhoneValidationResult {
  const dialCode = dialCodeInput.startsWith("+") ? dialCodeInput.trim() : `+${dialCodeInput.trim()}`;
  
  // Clean all non-digit characters from national number
  const cleanDigits = rawNationalNumber.replace(/\D/g, "");

  // Find country config
  const country = SUPPORTED_COUNTRIES.find((c) => c.dialCode === dialCode) || {
    code: "INTL",
    name: "International",
    dialCode,
    flag: "🌐",
    minLength: 7,
    maxLength: 15,
    pattern: /^\d{7,15}$/,
    placeholder: "123456789",
    hint: "7 to 15 digits",
  };

  // 1. Check basic presence
  if (!cleanDigits) {
    return {
      isValid: false,
      countryCode: country.code,
      dialCode,
      nationalNumber: "",
      formattedE164: "",
      displayFormatted: "",
      error: "Phone number is required.",
    };
  }

  // 2. Reject short sequences like "2455"
  if (cleanDigits.length < country.minLength) {
    return {
      isValid: false,
      countryCode: country.code,
      dialCode,
      nationalNumber: cleanDigits,
      formattedE164: `${dialCode}${cleanDigits}`,
      displayFormatted: `${dialCode} ${cleanDigits}`,
      error: `Phone number is too short (${cleanDigits.length} digits). ${country.name} numbers must have ${country.minLength} digits.`,
    };
  }

  // 3. Reject numbers that exceed maximum length
  if (cleanDigits.length > country.maxLength) {
    return {
      isValid: false,
      countryCode: country.code,
      dialCode,
      nationalNumber: cleanDigits,
      formattedE164: `${dialCode}${cleanDigits}`,
      displayFormatted: `${dialCode} ${cleanDigits}`,
      error: `Phone number is too long (${cleanDigits.length} digits). ${country.name} numbers cannot exceed ${country.maxLength} digits.`,
    };
  }

  // 4. Reject obviously fake repetitive sequences (e.g. "0000000000", "1111111111", "9999999999")
  if (/^(\d)\1+$/.test(cleanDigits)) {
    return {
      isValid: false,
      countryCode: country.code,
      dialCode,
      nationalNumber: cleanDigits,
      formattedE164: `${dialCode}${cleanDigits}`,
      displayFormatted: `${dialCode} ${cleanDigits}`,
      error: "Invalid phone number: repetitive sequence of identical digits.",
    };
  }

  // 5. Reject sequential sequences (e.g. "1234567890", "9876543210" if full length match)
  if (cleanDigits === "1234567890" || cleanDigits === "0123456789") {
    return {
      isValid: false,
      countryCode: country.code,
      dialCode,
      nationalNumber: cleanDigits,
      formattedE164: `${dialCode}${cleanDigits}`,
      displayFormatted: `${dialCode} ${cleanDigits}`,
      error: "Invalid phone number: sequential test numbers are not permitted.",
    };
  }

  // 6. Enforce country-specific regex pattern & prefix rules
  if (!country.pattern.test(cleanDigits)) {
    return {
      isValid: false,
      countryCode: country.code,
      dialCode,
      nationalNumber: cleanDigits,
      formattedE164: `${dialCode}${cleanDigits}`,
      displayFormatted: `${dialCode} ${cleanDigits}`,
      error: `Invalid phone format for ${country.name} (${country.dialCode}). ${country.hint}.`,
    };
  }

  // E.164 clean format: +[CountryCode][NationalNumber]
  const formattedE164 = `${dialCode}${cleanDigits}`;
  const displayFormatted = `${country.flag} ${dialCode} ${cleanDigits.replace(/(\d{5})(\d{5})/, "$1 $2")}`;

  return {
    isValid: true,
    countryCode: country.code,
    dialCode,
    nationalNumber: cleanDigits,
    formattedE164,
    displayFormatted,
  };
}

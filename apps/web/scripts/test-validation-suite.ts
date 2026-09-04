import { validatePhoneNumber } from "../src/lib/auth/phoneValidation";
import { validateEmail } from "../src/lib/auth/emailValidation";
import { issueOtp, verifyOtp, consumeVerificationToken } from "../src/lib/auth/otpService";

console.log("=== RUNNING AUTHENTICATION VALIDATION SUITE ===\n");

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

// 1. Phone Validation Tests
console.log("--- Phone Validation Tests ---");

// Short numbers like user's "2455"
const r1 = validatePhoneNumber("+91", "2455");
assert(!r1.isValid && Boolean(r1.error?.includes("too short")), "Rejects 4-digit number '2455' for India (+91)");

// Valid Indian numbers
const r2 = validatePhoneNumber("+91", "9876543210");
assert(r2.isValid && r2.formattedE164 === "+919876543210", "Accepts valid 10-digit Indian mobile 9876543210");

const r3 = validatePhoneNumber("+91", "6123456789");
assert(r3.isValid && r3.formattedE164 === "+916123456789", "Accepts valid Indian mobile starting with 6");

// Invalid Indian prefixes (starts with 1, 2, 3, 4, 5)
const r4 = validatePhoneNumber("+91", "1234567890");
assert(!r4.isValid, "Rejects Indian mobile starting with 1");

// Repetitive junk
const r5 = validatePhoneNumber("+91", "0000000000");
assert(!r5.isValid, "Rejects repetitive junk '0000000000'");

const r6 = validatePhoneNumber("+91", "9999999999");
assert(!r6.isValid, "Rejects repetitive junk '9999999999'");

// US valid & invalid
const r7 = validatePhoneNumber("+1", "2025550143");
assert(r7.isValid && r7.formattedE164 === "+12025550143", "Accepts valid US number +1 (202) 555-0143");

const r8 = validatePhoneNumber("+1", "2455");
assert(!r8.isValid && Boolean(r8.error?.includes("too short")), "Rejects 4-digit number '2455' for US (+1)");

// UK valid
const r9 = validatePhoneNumber("+44", "7911123456");
assert(r9.isValid && r9.formattedE164 === "+447911123456", "Accepts valid UK mobile +44 7911123456");

// 2. Email Validation Tests
console.log("\n--- Email Validation Tests ---");

const e1 = validateEmail("dhjds234@gmail.com");
assert(e1.isValid, "Accepts syntactically valid email dhjds234@gmail.com");

const e2 = validateEmail("invalid-email-no-at");
assert(!e2.isValid, "Rejects email without @ symbol");

const e3 = validateEmail("user@");
assert(!e3.isValid, "Rejects email without domain");

const e4 = validateEmail("user@tempmail.com");
assert(!e4.isValid && Boolean(e4.error?.includes("disposable")), "Blocks disposable domain tempmail.com");

const e5 = validateEmail("user@10minutemail.com");
assert(!e5.isValid && Boolean(e5.error?.includes("disposable")), "Blocks disposable domain 10minutemail.com");

const e6 = validateEmail("user@mailinator.com");
assert(!e6.isValid && Boolean(e6.error?.includes("disposable")), "Blocks disposable domain mailinator.com");

// 3. OTP Service Tests
console.log("\n--- OTP Service Tests ---");

const otpRes = issueOtp("+919876543210", "phone");
assert(otpRes.success && Boolean(otpRes.devCode), "Issues 6-digit OTP code successfully");

const testCode = otpRes.devCode!;
const verifyFail = verifyOtp("+919876543210", "000000");
assert(!verifyFail.success, "Rejects incorrect OTP code");

const verifyPass = verifyOtp("+919876543210", testCode);
assert(verifyPass.success && Boolean(verifyPass.verificationToken), "Verifies correct 6-digit OTP and issues token");

const token = verifyPass.verificationToken!;
const consumePass = consumeVerificationToken("+919876543210", token);
assert(consumePass, "Consumes verification token successfully");

const consumeAgain = consumeVerificationToken("+919876543210", token);
assert(!consumeAgain, "Prevents replay attack: token cannot be consumed twice");

console.log(`\n=== SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED ===\n`);

if (failed > 0) {
  process.exit(1);
}

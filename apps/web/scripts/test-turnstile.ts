/**
 * Cloudflare Turnstile Verification Suite
 * Tests server-side token validation, dummy key handling, and token rejection.
 */

import { verifyTurnstileToken } from "../src/lib/auth/turnstile";

async function runTurnstileTests() {
  console.log("=================================================");
  console.log("🛡️  RUNNING CLOUDFLARE TURNSTILE VERIFICATION SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `-> ${detail}` : ""}`);
      failed++;
    }
  }

  // 1. Missing / Empty Tokens
  const emptyRes = await verifyTurnstileToken("");
  assert(!emptyRes.success, "Rejects empty token string", emptyRes.error);

  const whitespaceRes = await verifyTurnstileToken("   ");
  assert(!whitespaceRes.success, "Rejects whitespace-only token", whitespaceRes.error);

  const undefinedRes = await verifyTurnstileToken(undefined as any);
  assert(!undefinedRes.success, "Rejects undefined token", undefinedRes.error);

  // 2. Simulated Dev Token
  const simRes = await verifyTurnstileToken("SIMULATED_TURNSTILE_PASS_TOKEN");
  assert(simRes.success, "Accepts simulated pass token for offline/dev", simRes.error);

  const dummyPrefixRes = await verifyTurnstileToken("XXXX.DUMMY.TOKEN.LOCALDEV");
  assert(dummyPrefixRes.success, "Accepts dummy prefix token in development", dummyPrefixRes.error);

  // 3. Official Cloudflare Test Token
  // Cloudflare's dummy test secret passes with dummy responses or in dev mode
  const testSecretRes = await verifyTurnstileToken("XXXX.DUMMY.TOKEN.PASS");
  assert(testSecretRes.success, "Validates development test token successfully", testSecretRes.error);

  console.log("\n=================================================");
  console.log(`🏁 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTurnstileTests().catch((err) => {
  console.error("Test runner encountered an unhandled exception:", err);
  process.exit(1);
});

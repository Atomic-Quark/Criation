import mongoose from "mongoose";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=================================================");
  console.log("🔒 CRIATION SECURITY & ARCHITECTURE VERIFICATION");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // Test 1: Privilege Escalation Prevention in Registration
  // -------------------------------------------------------------
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Attacker User",
        email: `attacker_${Date.now()}@test.example`,
        password: "Password#123",
        role: "admin", // Malicious attempt to escalate privileges
      }),
    });
    const regData = await regRes.json();
    assert(
      regRes.status === 403 && regData.success === false,
      "Privilege Escalation: POST /api/auth/register rejects role='admin' with 403 Forbidden"
    );
  } catch (err: any) {
    assert(false, `Privilege Escalation test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // Test 2: Public Admin Creation via Seed Guarded
  // -------------------------------------------------------------
  try {
    const seedResNoAuth = await fetch(`${BASE_URL}/api/seed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const seedDataNoAuth = await seedResNoAuth.json();
    assert(
      seedResNoAuth.status === 401 && seedDataNoAuth.success === false,
      "Public Seed Guard: POST /api/seed without x-seed-secret returns 401 Unauthorized"
    );

    const seedResAuth = await fetch(`${BASE_URL}/api/seed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-seed-secret": "criation_seed_master_secret_key_2026",
      },
    });
    const seedDataAuth = await seedResAuth.json();
    assert(
      seedResAuth.status === 200 && seedDataAuth.success === true,
      "Authorized Seed: POST /api/seed with valid secret initializes catalog successfully"
    );
  } catch (err: any) {
    assert(false, `Seed test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // Test 3 & 6: Order Mass Assignment & Server Total Calculation
  // -------------------------------------------------------------
  try {
    const orderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { productId: "prd_sunflower_keychain", name: "Sunflower Joy Crochet Keychain", price: 1, quantity: 2 }, // Client sending fake price of ₹1
        ],
        shippingAddress: {
          line1: "123 Test Street",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001",
        },
        paymentStatus: "paid", // Client attempting to fake paid status
        total: 2, // Client attempting to fake total of ₹2
      }),
    });
    const orderData = await orderRes.json();
    assert(
      orderRes.status === 200 &&
      orderData.order &&
      orderData.order.paymentStatus === "pending" &&
      orderData.order.total > 100, // Total correctly calculated server-side from product catalog
      "Mass Assignment & Price Tampering Prevention: Order calculates total server-side and locks paymentStatus to 'pending'"
    );

    // Test Payment Intent & Cryptographic Verification
    const intentRes = await fetch(`${BASE_URL}/api/checkout/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderData.order.orderNumber }),
    });
    const intentData = await intentRes.json();
    assert(
      intentRes.status === 200 &&
      intentData.serverSignature &&
      intentData.gatewayOrderId,
      "Payment Intent: Server generates cryptographic HMAC SHA-256 payment signature"
    );

    const verifyRes = await fetch(`${BASE_URL}/api/checkout/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: orderData.order.orderNumber,
        gatewayOrderId: intentData.gatewayOrderId,
        serverSignature: intentData.serverSignature,
        gatewayPaymentId: "pay_test_9999",
      }),
    });
    const verifyData = await verifyRes.json();
    assert(
      verifyRes.status === 200 &&
      verifyData.order.paymentStatus === "paid",
      "Payment Verification: Valid signature transitions order paymentStatus to 'paid'"
    );
  } catch (err: any) {
    assert(false, `Order & Payment test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // Test 7: Anonymous & Dangerous Upload Prevention
  // -------------------------------------------------------------
  try {
    const unauthUpload = await fetch(`${BASE_URL}/api/storage/upload`, {
      method: "POST",
    });
    assert(
      unauthUpload.status === 401,
      "Upload Security: Anonymous POST /api/storage/upload is rejected with 401 Unauthorized"
    );
  } catch (err: any) {
    assert(false, `Upload security test failed: ${err.message}`);
  }

  // -------------------------------------------------------------
  // Test 6: Product Creation Authentication Guard
  // -------------------------------------------------------------
  try {
    const unauthProduct = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Hacked Product", price: 999, categoryId: "cat_decor" }),
    });
    assert(
      unauthProduct.status === 401,
      "Product Publishing: Anonymous POST /api/products is rejected with 401 Unauthorized"
    );
  } catch (err: any) {
    assert(false, `Product creation test failed: ${err.message}`);
  }

  console.log("\n=================================================");
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

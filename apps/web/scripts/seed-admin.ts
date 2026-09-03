import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/criation";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "+91 XXXXX XXXXX" },
  role: { type: String, enum: ["customer", "seller", "supplier", "admin"], default: "customer" },
  isAdminVerified: { type: Boolean, default: false },
  walletBalance: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  tier: { type: String, default: "Gold" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@criation.example";
  const adminPassword = process.env.ADMIN_PASSWORD || "CriationAdmin#2026Secure";
  const adminName = process.env.ADMIN_NAME || "System Superadmin";

  console.log(`[Admin Seed] Connecting to MongoDB: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  if (existing) {
    existing.role = "admin";
    existing.isAdminVerified = true;
    existing.passwordHash = passwordHash;
    existing.name = adminName;
    await existing.save();
    console.log(`[Admin Seed] Updated existing admin user: ${adminEmail}`);
  } else {
    await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "admin",
      isAdminVerified: true,
      walletBalance: 2500,
      loyaltyPoints: 1000,
      tier: "Diamond VIP",
    });
    console.log(`[Admin Seed] Created new verified admin user: ${adminEmail}`);
  }

  console.log(`[Admin Seed] Admin email: ${adminEmail}`);
  console.log(`[Admin Seed] Role: admin (Verified: true)`);
  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("[Admin Seed Error]:", err);
  process.exit(1);
});

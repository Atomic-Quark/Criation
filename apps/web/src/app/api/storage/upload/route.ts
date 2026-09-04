import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Upload } from "@/lib/db/models/Upload";
import { requireRole } from "@/lib/auth/requireRole";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/auth/rateLimit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

/**
 * Validates file signature (magic bytes) to prevent disguised executable/script uploads.
 */
function isValidMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  const hex = buffer.subarray(0, 4).toString("hex").toUpperCase();

  switch (mimeType) {
    case "image/jpeg":
      return hex.startsWith("FFD8FF");
    case "image/png":
      return hex.startsWith("89504E47");
    case "image/webp":
      return buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
             buffer.subarray(8, 12).toString("ascii") === "WEBP";
    case "image/gif":
      return hex.startsWith("47494638");
    case "application/pdf":
      return hex.startsWith("25504446");
    default:
      return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 0. Rate Limiting (10 uploads per 60 seconds per IP)
    const rateCheck = await checkRateLimit(req, {
      maxRequests: 10,
      windowSeconds: 60,
      action: "storage:upload",
    });
    if (!rateCheck.success) {
      return rateLimitExceededResponse(rateCheck);
    }

    // 1. Defense-in-Depth Authentication Check
    const auth = await requireRole(req, ["customer", "artisan", "seller", "supplier", "admin"]);
    if (!auth.ok) return auth.response;
    const session = auth.user;

    // 2. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "product";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    // 3. File Size Check (Max 5 MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 5MB limit. Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`,
        },
        { status: 413 }
      );
    }

    // 4. MIME Type Whitelist Check
    const mimeType = file.type?.toLowerCase();
    if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: "${file.type}". Allowed formats are JPEG, PNG, WebP, GIF, and PDF.`,
        },
        { status: 415 }
      );
    }

    // 5. Inspect Magic Bytes (File Signature Verification)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!isValidMagicBytes(buffer, mimeType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Corrupted or invalid file signature detected. Upload rejected.",
        },
        { status: 400 }
      );
    }

    // 6. Secure Filename Generation (Prevent Path Traversal)
    const timestamp = Date.now();
    const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1] || "bin";
    const sanitizedBase = path.basename(file.name).replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
    const filename = `${timestamp}_${sanitizedBase}.${extension}`;

    // Target upload folder in public/uploads with local persistence
    let publicUrl = `/uploads/${filename}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
    } catch (fsErr: any) {
      console.warn("[Storage API] Local write warning (using data URI fallback):", fsErr.message);
      // In serverless / read-only filesystem environments, fall back gracefully to a Base64 Data URL
      publicUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    // 7. Record Upload Metadata in Database
    try {
      await connectToDatabase();
      const validCategory = (["product", "avatar", "proof", "general"].includes(category) ? category : "product") as "product" | "avatar" | "proof" | "general";
      await Upload.create({
        filename,
        originalName: path.basename(file.name),
        mimeType,
        size: file.size,
        url: publicUrl,
        storageProvider: "local",
        userId: session.userId,
        category: validCategory,
      });
    } catch (dbErr: any) {
      console.warn("[Upload API] Metadata record creation warning:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded and verified successfully.",
      url: publicUrl,
      filename,
      size: file.size,
      mimeType,
    });
  } catch (error: any) {
    console.error("[Storage Upload Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process file upload." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

// Storage priority:
//   1. Vercel Blob  — if BLOB_READ_WRITE_TOKEN is set (free on Vercel, zero config)
//   2. Cloudinary   — if CLOUDINARY_* keys are set
//   3. Error        — tell the user to configure storage

const blobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

const cloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== "your_api_secret";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// 4 MB — safely under Vercel's 4.5 MB response limit
const MAX_SIZE = 4 * 1024 * 1024;

// Public endpoint — no auth required (job applicants upload their CV)
export async function POST(req: NextRequest) {
  let fileName = "cv.pdf";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided", code: "NO_FILE" },
        { status: 400 }
      );
    }

    fileName = file.name;

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only PDF, DOC, and DOCX files are accepted", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File must be under 4 MB", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    // ── 1. Vercel Blob (preferred on Vercel — free, zero config) ──────────────
    if (blobConfigured) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`cvs/${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`, file, {
        access: "public",
        contentType: file.type,
      });

      return NextResponse.json({
        success: true,
        data: { url: blob.url, publicId: blob.pathname, fileName },
      });
    }

    // ── 2. Cloudinary ─────────────────────────────────────────────────────────
    if (cloudinaryConfigured) {
      const { cloudinary } = await import("@/lib/cloudinary");
      const bytes = await file.arrayBuffer();
      const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "velorent/cvs",
        resource_type: "raw",
        public_id: `cv_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, "_")}`,
      });

      return NextResponse.json({
        success: true,
        data: { url: result.secure_url, publicId: result.public_id, fileName },
      });
    }

    // ── 3. No storage configured ──────────────────────────────────────────────
    // In development: return a placeholder so the form flow can be tested.
    // In production: fail clearly so the issue is obvious.
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({
        success: true,
        data: {
          url: `https://placeholder.velorent.dev/cv/${Date.now()}_${fileName}`,
          publicId: `dev_${Date.now()}`,
          fileName,
          mock: true,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "File storage is not configured. Add BLOB_READ_WRITE_TOKEN to your Vercel environment variables.",
        code: "STORAGE_NOT_CONFIGURED",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("[CV_UPLOAD]", error);
    return NextResponse.json(
      { success: false, error: "File upload failed. Please try again.", code: "UPLOAD_FAILED" },
      { status: 500 }
    );
  }
}

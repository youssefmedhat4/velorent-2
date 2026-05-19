import { NextRequest, NextResponse } from "next/server";

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

    // Read env vars fresh inside the function — not at module load time
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudKey = process.env.CLOUDINARY_API_KEY;
    const cloudSecret = process.env.CLOUDINARY_API_SECRET;

    const blobConfigured = !!blobToken;
    const cloudinaryConfigured =
      !!cloudName && cloudName !== "your_cloud_name" &&
      !!cloudKey && cloudKey !== "your_api_key" &&
      !!cloudSecret && cloudSecret !== "your_api_secret";

    // ── 1. Vercel Blob ────────────────────────────────────────────────────────
    if (blobConfigured) {
      try {
        const { put } = await import("@vercel/blob");
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

        // Read the file as a Buffer — more reliable than passing the File object directly
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const blob = await put(`cvs/${Date.now()}_${safeName}`, buffer, {
          access: "public",
          contentType: file.type,
          token: blobToken,
          addRandomSuffix: false,
        });

        return NextResponse.json({
          success: true,
          data: { url: blob.url, publicId: blob.pathname, fileName },
        });
      } catch (blobError) {
        console.error("[CV_UPLOAD_BLOB]", blobError);
        // Fall through to Cloudinary if Blob fails
      }
    }

    // ── 2. Cloudinary ─────────────────────────────────────────────────────────
    if (cloudinaryConfigured) {
      try {
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
      } catch (cloudinaryError) {
        console.error("[CV_UPLOAD_CLOUDINARY]", cloudinaryError);
      }
    }

    // ── 3. Dev fallback ───────────────────────────────────────────────────────
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

    // ── 4. Nothing configured ─────────────────────────────────────────────────
    console.error("[CV_UPLOAD] No storage configured. BLOB_READ_WRITE_TOKEN:", !!blobToken, "Cloudinary:", cloudinaryConfigured);
    return NextResponse.json(
      {
        success: false,
        error: "File storage is not configured. Please contact support.",
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

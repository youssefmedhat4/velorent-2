import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

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

    // Check Cloudinary first if configured (more control over file types)
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudKey = process.env.CLOUDINARY_API_KEY;
    const cloudSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryConfigured =
      !!cloudName && cloudName !== "your_cloud_name" &&
      !!cloudKey && cloudKey !== "your_api_key" &&
      !!cloudSecret && cloudSecret !== "your_api_secret";

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

    // Vercel Blob — works on all Vercel plans, token auto-injected
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blob = await put(`cvs/${Date.now()}_${safeName}`, file, {
      access: "public",
    });

    return NextResponse.json({
      success: true,
      data: { url: blob.url, publicId: blob.pathname, fileName },
    });

  } catch (error) {
    console.error("[CV_UPLOAD]", error);
    // Log the specific error message for Vercel logs
    const message = error instanceof Error ? error.message : String(error);
    console.error("[CV_UPLOAD_DETAIL]", message);
    return NextResponse.json(
      { success: false, error: "File upload failed. Please try again.", code: "UPLOAD_FAILED" },
      { status: 500 }
    );
  }
}

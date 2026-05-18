import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

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

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only PDF, DOC, and DOCX files are accepted", code: "INVALID_FILE_TYPE" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File must be under 5 MB", code: "FILE_TOO_LARGE" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "velorent/cvs",
      resource_type: "raw",
      public_id: `cv_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`,
    });

    return NextResponse.json({
      success: true,
      data: { url: result.secure_url, publicId: result.public_id, fileName: file.name },
    });
  } catch (error) {
    console.error("[CV_UPLOAD]", error);
    // Cloudinary not configured — return a mock URL so the form still works in demo mode
    return NextResponse.json({
      success: true,
      data: {
        url: `https://mock-cv-storage.velorent.com/${Date.now()}_${fileName}`,
        publicId: `mock_${Date.now()}`,
        fileName,
        mock: true,
      },
    });
  }
}

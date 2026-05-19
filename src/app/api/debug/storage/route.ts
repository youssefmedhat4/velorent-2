import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Admin-only diagnostic endpoint — check storage config at runtime
// Visit /api/debug/storage while logged in as admin to see what's configured
export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin only" }, { status: 401 });
  }

  return NextResponse.json({
    blob: {
      configured: !!process.env.BLOB_READ_WRITE_TOKEN,
      tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 12) ?? "NOT SET",
    },
    cloudinary: {
      configured:
        !!process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name",
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "NOT SET",
    },
    nodeEnv: process.env.NODE_ENV,
  });
}

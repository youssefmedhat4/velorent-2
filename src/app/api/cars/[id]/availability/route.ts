import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bookings = await prisma.booking.findMany({
      where: {
        carId: id,
        status: { in: ["CONFIRMED", "ACTIVE", "PENDING"] },
        endDate: { gte: new Date() },
      },
      select: { startDate: true, endDate: true },
    });

    return NextResponse.json({
      success: true,
      data: bookings.map((b) => ({
        start: b.startDate.toISOString(),
        end: b.endDate.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[CAR_AVAILABILITY]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

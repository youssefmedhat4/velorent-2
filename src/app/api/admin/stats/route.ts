import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalRevenue,
      monthlyRevenue,
      totalBookings,
      todayBookings,
      activeRentals,
      totalCars,
      availableCars,
      totalUsers,
      newUsersThisMonth,
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      prisma.booking.count(),
      prisma.booking.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.booking.count({
        where: { status: "ACTIVE" },
      }),
      prisma.car.count(),
      prisma.car.count({ where: { available: true } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.user.count({
        where: { createdAt: { gte: monthStart }, role: "USER" },
      }),
    ]);

    // Monthly revenue for last 6 months
    const revenueData = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(now, 5 - i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        return prisma.payment
          .aggregate({
            where: { status: "PAID", paidAt: { gte: start, lte: end } },
            _sum: { amount: true },
            _count: true,
          })
          .then((result) => ({
            month: date.toLocaleString("default", { month: "short", year: "2-digit" }),
            revenue: result._sum.amount ?? 0,
            bookings: result._count,
          }));
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.amount ?? 0,
        monthlyRevenue: monthlyRevenue._sum.amount ?? 0,
        totalBookings,
        todayBookings,
        activeRentals,
        totalCars,
        availableCars,
        totalUsers,
        newUsersThisMonth,
        revenueData,
      },
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

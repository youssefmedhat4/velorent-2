import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Car3DViewer } from "@/components/cars/Car3DViewer";
import { CarDetailHeader } from "@/components/cars/CarDetailHeader";
import {
  WishlistBookingWrapper,
  BookingFormSuspense,
} from "@/components/cars/WishlistBookingWrapper";
import { BookingForm } from "@/components/booking/BookingForm";
import { StarRating } from "@/components/shared/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import type { CarWithRelations } from "@/types";
import {
  Users,
  Fuel,
  Zap,
  Gauge,
  Calendar,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CarDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const car = await prisma.car.findUnique({
    where: { id },
    select: { name: true, brand: true, description: true },
  });

  if (!car) return { title: "Car Not Found" };

  return {
    title: `${car.brand} ${car.name}`,
    description: car.description.slice(0, 160),
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;

  const [car, locations] = await Promise.all([
    prisma.car.findUnique({
      where: { id },
      include: {
        location: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.location.findMany({ orderBy: { city: "asc" } }),
  ]);

  if (!car) notFound();

  const averageRating =
    car.reviews.length > 0
      ? car.reviews.reduce((sum, r) => sum + r.rating, 0) / car.reviews.length
      : 0;

  const specs = [
    { icon: Users, label: "Seats", value: `${car.seats} passengers` },
    { icon: Zap, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuelType },
    { icon: Calendar, label: "Year", value: car.year.toString() },
    ...(car.mileage
      ? [{ icon: Gauge, label: "Mileage", value: `${car.mileage.toLocaleString()} km` }]
      : []),
    ...(car.location
      ? [{ icon: MapPin, label: "Location", value: car.location.city }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <a href="/cars" className="hover:text-white transition-colors">
            Cars
          </a>
          <span>/</span>
          <span className="text-zinc-300">{car.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: 3D Viewer */}
          <div className="space-y-4">
            <div className="h-[480px]">
              <Car3DViewer
                modelUrl={car.modelUrl}
                images={car.images}
                carName={car.name}
              />
            </div>
          </div>

          {/* Right: Details + Booking */}
          <WishlistBookingWrapper>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="mb-2 flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-[#E8FF00]/30 text-[#E8FF00] text-xs"
                  >
                    {car.category}
                  </Badge>
                  {!car.available && (
                    <Badge variant="destructive" className="text-xs">
                      Unavailable
                    </Badge>
                  )}
                </div>
                <CarDetailHeader carId={car.id} />
              </div>
              <h1 className="font-display text-4xl font-black uppercase text-white">
                {car.name}
              </h1>
              <p className="mt-1 text-lg text-zinc-400">
                {car.brand} · {car.model} · {car.year}
              </p>

              {/* Rating */}
              {car._count.reviews > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <StarRating rating={averageRating} showValue />
                  <span className="text-sm text-zinc-500">
                    ({car._count.reviews} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {formatCurrency(car.pricePerDay)}
              </span>
              <span className="text-zinc-500">/ day</span>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/5 bg-[#111113] p-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-500">{label}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-300">About</h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {car.description}
              </p>
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-zinc-300">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature) => (
                    <span
                      key={feature}
                      className="flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs text-zinc-300"
                    >
                      <CheckCircle2 className="h-3 w-3 text-[#E8FF00]" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Form */}
            <BookingFormSuspense>
              <BookingForm
                car={{ ...car, averageRating } as CarWithRelations}
                locations={locations}
              />
            </BookingFormSuspense>
          </div>
          </WishlistBookingWrapper>
        </div>

        {/* Reviews Section */}
        {car.reviews.length > 0 && (
          <div className="mt-16">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display text-3xl font-black uppercase text-white">
                Reviews
              </h2>
              <div className="flex items-center gap-2">
                <StarRating rating={averageRating} size="lg" showValue />
                <span className="text-sm text-zinc-500">
                  {car._count.reviews} reviews
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {car.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-white/5 bg-[#111113] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={review.user.avatar ?? undefined} />
                        <AvatarFallback className="bg-zinc-800 text-xs text-zinc-300">
                          {getInitials(review.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {review.user.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

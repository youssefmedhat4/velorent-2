import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CarForm } from "@/components/admin/CarForm";
import type { CarWithRelations } from "@/types";

interface EditCarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { id } = await params;

  const car = await prisma.car.findUnique({
    where: { id },
    include: { location: true },
  });

  if (!car) notFound();

  // Cast to CarWithRelations — reviews not needed for the edit form
  return <CarForm car={car as unknown as CarWithRelations} mode="edit" />;
}

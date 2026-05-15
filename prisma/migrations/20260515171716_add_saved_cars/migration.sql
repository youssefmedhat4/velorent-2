-- CreateTable
CREATE TABLE "saved_cars" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "carId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_cars_userId_idx" ON "saved_cars"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_cars_userId_carId_key" ON "saved_cars"("userId", "carId");

-- AddForeignKey
ALTER TABLE "saved_cars" ADD CONSTRAINT "saved_cars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_cars" ADD CONSTRAINT "saved_cars_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

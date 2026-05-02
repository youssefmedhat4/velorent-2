import { PrismaClient, CarCategory, Transmission, FuelType, BookingStatus, PaymentStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";
import { config } from "dotenv";

// Load .env.local first, fall back to .env
config({ path: ".env.local" });
config({ path: ".env" });

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  // Admin user
  const adminPassword = await bcrypt.hash("Admin1234!", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@velorent.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Regular users
  const userPassword = await bcrypt.hash("User1234!", 12);
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Alice Johnson", email: "alice@example.com", password: userPassword } }),
    prisma.user.create({ data: { name: "Bob Smith", email: "bob@example.com", password: userPassword } }),
    prisma.user.create({ data: { name: "Carol White", email: "carol@example.com", password: userPassword } }),
    prisma.user.create({ data: { name: "David Brown", email: "david@example.com", password: userPassword } }),
    prisma.user.create({ data: { name: "Emma Davis", email: "emma@example.com", password: userPassword } }),
  ]);

  console.log("✅ Users created");

  // Locations
  const locations = await Promise.all([
    prisma.location.create({ data: { name: "JFK International Airport", address: "Queens, NY 11430", city: "New York", latitude: 40.6413, longitude: -73.7781 } }),
    prisma.location.create({ data: { name: "LAX Airport Terminal", address: "1 World Way, Los Angeles, CA 90045", city: "Los Angeles", latitude: 33.9425, longitude: -118.4081 } }),
    prisma.location.create({ data: { name: "Miami Beach Hub", address: "1601 Collins Ave, Miami Beach, FL 33139", city: "Miami", latitude: 25.7617, longitude: -80.1918 } }),
    prisma.location.create({ data: { name: "Chicago Downtown", address: "233 S Wacker Dr, Chicago, IL 60606", city: "Chicago", latitude: 41.8781, longitude: -87.6298 } }),
    prisma.location.create({ data: { name: "Las Vegas Strip", address: "3600 S Las Vegas Blvd, Las Vegas, NV 89109", city: "Las Vegas", latitude: 36.1147, longitude: -115.1728 } }),
  ]);

  console.log("✅ Locations created");

  // Cars with Unsplash images
  const carData = [
    {
      name: "Lamborghini Huracán EVO",
      brand: "Lamborghini",
      model: "Huracán EVO",
      year: 2023,
      category: CarCategory.SPORTS,
      pricePerDay: 899,
      seats: 2,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      mileage: 5000,
      color: "Arancio Borealis",
      description: "The Lamborghini Huracán EVO represents the next step in the evolution of the V10 naturally aspirated engine. With 640 CV and a top speed of 325 km/h, this is pure Italian engineering at its finest.",
      features: ["Carbon Fiber Interior", "Launch Control", "Magnetic Ride", "Sport Exhaust", "Apple CarPlay", "Rear Camera"],
      images: [
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      ],
      locationId: locations[1].id,
    },
    {
      name: "Ferrari 488 GTB",
      brand: "Ferrari",
      model: "488 GTB",
      year: 2022,
      category: CarCategory.SPORTS,
      pricePerDay: 799,
      seats: 2,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      mileage: 8000,
      color: "Rosso Corsa",
      description: "The Ferrari 488 GTB is a mid-engine sports car that delivers 660 CV from its twin-turbocharged 3.9L V8. A masterpiece of performance and Italian design.",
      features: ["F1 Trac", "E-Diff3", "Side Slip Control", "Carbon Ceramic Brakes", "Bose Sound System"],
      images: [
        "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
      ],
      locationId: locations[0].id,
    },
    {
      name: "Porsche 911 Turbo S",
      brand: "Porsche",
      model: "911 Turbo S",
      year: 2023,
      category: CarCategory.SPORTS,
      pricePerDay: 599,
      seats: 4,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      mileage: 12000,
      color: "GT Silver Metallic",
      description: "The Porsche 911 Turbo S is the pinnacle of the 911 lineup. With 650 PS and all-wheel drive, it accelerates from 0-100 km/h in just 2.7 seconds.",
      features: ["PASM Sport", "Sport Chrono Package", "Burmester Sound", "Night Vision", "Adaptive Cruise Control"],
      images: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        "https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?w=800&q=80",
      ],
      locationId: locations[2].id,
    },
    {
      name: "Rolls-Royce Ghost",
      brand: "Rolls-Royce",
      model: "Ghost",
      year: 2023,
      category: CarCategory.LUXURY,
      pricePerDay: 1299,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      mileage: 3000,
      color: "Andalusian White",
      description: "The Rolls-Royce Ghost is the definitive expression of effortless luxury. Its 6.75L twin-turbocharged V12 delivers 571 bhp with whisper-quiet refinement.",
      features: ["Starlight Headliner", "Bespoke Audio", "Massage Seats", "Night Vision", "Panoramic Roof", "Champagne Cooler"],
      images: [
        "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=800&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      ],
      locationId: locations[0].id,
    },
    {
      name: "Bentley Continental GT",
      brand: "Bentley",
      model: "Continental GT",
      year: 2023,
      category: CarCategory.LUXURY,
      pricePerDay: 899,
      seats: 4,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      mileage: 6000,
      color: "Midnight Emerald",
      description: "The Bentley Continental GT is the ultimate grand tourer. Its 6.0L W12 engine produces 635 bhp, combining breathtaking performance with unparalleled luxury.",
      features: ["Naim Audio", "Rotating Display", "Massage Seats", "Heated Steering Wheel", "All-Wheel Drive"],
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
      ],
      locationId: locations[3].id,
    },
    {
      name: "Tesla Model S Plaid",
      brand: "Tesla",
      model: "Model S Plaid",
      year: 2023,
      category: CarCategory.ELECTRIC,
      pricePerDay: 299,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.ELECTRIC,
      mileage: 15000,
      color: "Midnight Silver",
      description: "The Tesla Model S Plaid is the fastest production car ever made. With three motors producing 1,020 hp, it reaches 0-60 mph in under 2 seconds.",
      features: ["Autopilot", "17\" Touchscreen", "Over-the-Air Updates", "Supercharger Access", "Gaming Computer", "HEPA Filter"],
      images: [
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
        "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=800&q=80",
      ],
      locationId: locations[1].id,
    },
    {
      name: "BMW X7 M60i",
      brand: "BMW",
      model: "X7 M60i",
      year: 2023,
      category: CarCategory.SUV,
      pricePerDay: 349,
      seats: 7,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      mileage: 20000,
      color: "Carbon Black",
      description: "The BMW X7 M60i is the ultimate luxury SUV. With a 4.4L V8 producing 530 hp and seating for 7, it combines performance with family practicality.",
      features: ["Panoramic Sky Lounge", "Bowers & Wilkins Audio", "Massage Seats", "Gesture Control", "Parking Assistant Plus"],
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      ],
      locationId: locations[4].id,
    },
    {
      name: "Range Rover Autobiography",
      brand: "Land Rover",
      model: "Range Rover Autobiography",
      year: 2023,
      category: CarCategory.SUV,
      pricePerDay: 449,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.HYBRID,
      mileage: 10000,
      color: "Santorini Black",
      description: "The Range Rover Autobiography is the pinnacle of luxury SUVs. Its plug-in hybrid powertrain delivers both efficiency and performance with unmatched off-road capability.",
      features: ["Executive Rear Seats", "Meridian Signature Sound", "Terrain Response 2", "Air Suspension", "Head-Up Display"],
      images: [
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
      ],
      locationId: locations[2].id,
    },
    {
      name: "Mercedes-Benz S-Class",
      brand: "Mercedes-Benz",
      model: "S 580 4MATIC",
      year: 2023,
      category: CarCategory.LUXURY,
      pricePerDay: 499,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.PETROL,
      mileage: 8000,
      color: "Obsidian Black",
      description: "The Mercedes-Benz S-Class sets the benchmark for luxury sedans. With its 4.0L V8 biturbo and MBUX Hyperscreen, it represents the future of automotive luxury.",
      features: ["MBUX Hyperscreen", "E-Active Body Control", "Burmester 4D Sound", "Augmented Reality Navigation", "Rear Axle Steering"],
      images: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      ],
      locationId: locations[3].id,
    },
    {
      name: "Toyota Camry XSE",
      brand: "Toyota",
      model: "Camry XSE",
      year: 2023,
      category: CarCategory.COMPACT,
      pricePerDay: 79,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.HYBRID,
      mileage: 25000,
      color: "Midnight Black",
      description: "The Toyota Camry XSE Hybrid combines sporty styling with exceptional fuel efficiency. Perfect for business travel or family road trips.",
      features: ["Toyota Safety Sense", "Apple CarPlay", "Android Auto", "Wireless Charging", "Adaptive Cruise Control"],
      images: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
      ],
      locationId: locations[0].id,
    },
    {
      name: "Honda CR-V Touring",
      brand: "Honda",
      model: "CR-V Touring",
      year: 2023,
      category: CarCategory.SUV,
      pricePerDay: 99,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.HYBRID,
      mileage: 18000,
      color: "Sonic Gray Pearl",
      description: "The Honda CR-V Touring Hybrid is the perfect family SUV. With its spacious interior, advanced safety features, and excellent fuel economy, it's ideal for any adventure.",
      features: ["Honda Sensing", "Panoramic Sunroof", "Heated Seats", "Apple CarPlay", "Wireless Charging", "Power Tailgate"],
      images: [
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
      ],
      locationId: locations[4].id,
    },
    {
      name: "Ford Mustang GT500",
      brand: "Ford",
      model: "Shelby GT500",
      year: 2022,
      category: CarCategory.SPORTS,
      pricePerDay: 249,
      seats: 4,
      transmission: Transmission.MANUAL,
      fuelType: FuelType.PETROL,
      mileage: 12000,
      color: "Grabber Blue",
      description: "The Ford Shelby GT500 is the most powerful street-legal Ford ever built. Its supercharged 5.2L V8 produces 760 hp, delivering an unforgettable driving experience.",
      features: ["MagneRide Damping", "Brembo Brakes", "Track Apps", "Launch Control", "Line Lock", "Recaro Seats"],
      images: [
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
        "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&q=80",
      ],
      locationId: locations[2].id,
    },
    {
      name: "Volkswagen Golf GTI",
      brand: "Volkswagen",
      model: "Golf GTI",
      year: 2023,
      category: CarCategory.ECONOMY,
      pricePerDay: 69,
      seats: 5,
      transmission: Transmission.MANUAL,
      fuelType: FuelType.PETROL,
      mileage: 22000,
      color: "Tornado Red",
      description: "The Volkswagen Golf GTI is the original hot hatch, refined to perfection. With 245 hp and precise handling, it delivers driving joy in a practical package.",
      features: ["Digital Cockpit Pro", "Harman Kardon Audio", "Adaptive Cruise Control", "Wireless CarPlay", "DCC Adaptive Chassis"],
      images: [
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
      ],
      locationId: locations[1].id,
    },
    {
      name: "Audi e-tron GT",
      brand: "Audi",
      model: "e-tron GT quattro",
      year: 2023,
      category: CarCategory.ELECTRIC,
      pricePerDay: 399,
      seats: 4,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.ELECTRIC,
      mileage: 7000,
      color: "Kemora Gray",
      description: "The Audi e-tron GT is a stunning electric grand tourer. With 476 hp, 800V charging architecture, and a range of 488 km, it redefines electric performance.",
      features: ["Matrix LED Headlights", "Bang & Olufsen Sound", "Air Suspension", "Augmented Reality HUD", "22kW AC Charging"],
      images: [
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      ],
      locationId: locations[3].id,
    },
    {
      name: "Mercedes Sprinter Van",
      brand: "Mercedes-Benz",
      model: "Sprinter 2500",
      year: 2022,
      category: CarCategory.VAN,
      pricePerDay: 149,
      seats: 12,
      transmission: Transmission.AUTOMATIC,
      fuelType: FuelType.DIESEL,
      mileage: 35000,
      color: "Arctic White",
      description: "The Mercedes-Benz Sprinter is the ultimate commercial van. Perfect for group travel, airport transfers, or cargo transport with its spacious interior.",
      features: ["MBUX Navigation", "Rear View Camera", "Cruise Control", "Climate Control", "USB Charging Ports"],
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      ],
      locationId: locations[0].id,
    },
  ];

  const cars = await Promise.all(carData.map((data) => prisma.car.create({ data })));

  console.log("✅ Cars created");

  // Bookings
  const now = new Date();
  const bookingsData = [
    {
      userId: users[0].id,
      carId: cars[0].id,
      startDate: addDays(now, 5),
      endDate: addDays(now, 8),
      totalDays: 3,
      totalPrice: 2697,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[1].id,
    },
    {
      userId: users[1].id,
      carId: cars[3].id,
      startDate: addDays(now, 2),
      endDate: addDays(now, 5),
      totalDays: 3,
      totalPrice: 3897,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[0].id,
    },
    {
      userId: users[2].id,
      carId: cars[5].id,
      startDate: subDays(now, 3),
      endDate: addDays(now, 1),
      totalDays: 4,
      totalPrice: 1196,
      status: BookingStatus.ACTIVE,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[1].id,
    },
    {
      userId: users[3].id,
      carId: cars[9].id,
      startDate: subDays(now, 10),
      endDate: subDays(now, 7),
      totalDays: 3,
      totalPrice: 237,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[0].id,
    },
    {
      userId: users[4].id,
      carId: cars[2].id,
      startDate: subDays(now, 5),
      endDate: subDays(now, 2),
      totalDays: 3,
      totalPrice: 1797,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[2].id,
    },
    {
      userId: users[0].id,
      carId: cars[6].id,
      startDate: addDays(now, 10),
      endDate: addDays(now, 14),
      totalDays: 4,
      totalPrice: 1396,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      pickupLocationId: locations[4].id,
    },
    {
      userId: users[1].id,
      carId: cars[11].id,
      startDate: subDays(now, 15),
      endDate: subDays(now, 12),
      totalDays: 3,
      totalPrice: 747,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[2].id,
    },
    {
      userId: users[2].id,
      carId: cars[8].id,
      startDate: subDays(now, 20),
      endDate: subDays(now, 17),
      totalDays: 3,
      totalPrice: 1497,
      status: BookingStatus.CANCELLED,
      paymentStatus: PaymentStatus.REFUNDED,
      pickupLocationId: locations[3].id,
    },
    {
      userId: users[3].id,
      carId: cars[13].id,
      startDate: subDays(now, 8),
      endDate: subDays(now, 5),
      totalDays: 3,
      totalPrice: 1197,
      status: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[3].id,
    },
    {
      userId: users[4].id,
      carId: cars[4].id,
      startDate: addDays(now, 7),
      endDate: addDays(now, 10),
      totalDays: 3,
      totalPrice: 2697,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      pickupLocationId: locations[3].id,
    },
  ];

  const bookings = await Promise.all(
    bookingsData.map((data) => prisma.booking.create({ data }))
  );

  // Create payments for paid bookings
  await Promise.all(
    bookings
      .filter((b) => b.paymentStatus === "PAID" || b.paymentStatus === "REFUNDED")
      .map((b) =>
        prisma.payment.create({
          data: {
            bookingId: b.id,
            amount: b.totalPrice,
            currency: "usd",
            method: "card",
            status: b.paymentStatus,
            paidAt: b.paymentStatus === "PAID" ? new Date() : undefined,
          },
        })
      )
  );

  console.log("✅ Bookings and payments created");

  // Reviews for completed bookings
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const reviewsData = [
    { rating: 5, comment: "Absolutely incredible car! The Lamborghini was a dream to drive. Pickup was seamless and the car was in perfect condition." },
    { rating: 5, comment: "The Ferrari exceeded all expectations. Pure driving pleasure. Will definitely rent again!" },
    { rating: 4, comment: "Great experience overall. The Mustang was powerful and fun. Minor issue with the GPS but staff resolved it quickly." },
    { rating: 5, comment: "The Audi e-tron GT is the future of driving. Silent, fast, and incredibly comfortable. Highly recommend!" },
    { rating: 4, comment: "Excellent service and a beautiful car. The Camry was perfect for our business trip. Very comfortable and fuel efficient." },
    { rating: 5, comment: "Best car rental experience I've ever had. The Range Rover was immaculate and the staff were incredibly helpful." },
    { rating: 5, comment: "The Porsche 911 was everything I dreamed of. VeloRent made the whole process effortless." },
    { rating: 4, comment: "Great car, great service. The Tesla was amazing for a road trip. Supercharger network made it stress-free." },
  ];

  await Promise.all(
    completedBookings.slice(0, reviewsData.length).map((booking, i) =>
      prisma.review.create({
        data: {
          userId: booking.userId,
          carId: booking.carId,
          bookingId: booking.id,
          rating: reviewsData[i].rating,
          comment: reviewsData[i].comment,
        },
      })
    )
  );

  console.log("✅ Reviews created");
  console.log("\n🎉 Seed complete!");
  console.log("\n📧 Admin credentials:");
  console.log("   Email: admin@velorent.com");
  console.log("   Password: Admin1234!");
  console.log("\n📧 User credentials:");
  console.log("   Email: alice@example.com");
  console.log("   Password: User1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

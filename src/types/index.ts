import type {
  User,
  Car,
  Booking,
  Payment,
  Review,
  Location,
  UserRole,
  BookingStatus,
  PaymentStatus,
  CarCategory,
  Transmission,
  FuelType,
} from "@prisma/client";

// Re-export Prisma enums
export type {
  UserRole,
  BookingStatus,
  PaymentStatus,
  CarCategory,
  Transmission,
  FuelType,
};

// Make _count optional with just reviews for flexibility
export type CarWithRelations = Car & {
  location?: Location | null;
  reviews?: ReviewWithUser[];
  _count?: { bookings?: number; reviews: number };
  averageRating?: number;
};

export type BookingWithRelations = Booking & {
  user?: User;
  car?: CarWithRelations;
  pickupLocation?: Location | null;
  dropoffLocation?: Location | null;
  payment?: Payment | null;
  review?: Review | null;
};

export type ReviewWithUser = Review & {
  user: Pick<User, "id" | "name" | "avatar">;
};

export type UserWithStats = User & {
  _count?: { bookings: number; reviews: number };
};

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types
export interface CarFilters {
  category?: CarCategory;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
  city?: string;
  transmission?: Transmission;
  fuelType?: FuelType;
  seats?: number;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface BookingFormData {
  carId: string;
  startDate: Date;
  endDate: Date;
  pickupLocationId?: string;
  dropoffLocationId?: string;
  notes?: string;
}

export interface CarFormData {
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  seats: number;
  transmission: Transmission;
  fuelType: FuelType;
  mileage?: number;
  color: string;
  description: string;
  features: string[];
  images: string[];
  modelUrl?: string;
  available: boolean;
  locationId?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  todayBookings: number;
  activeRentals: number;
  totalCars: number;
  availableCars: number;
  totalUsers: number;
  newUsersThisMonth: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  bookings: number;
}

// Session user type
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

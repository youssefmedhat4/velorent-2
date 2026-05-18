export type UserRole = "USER" | "ADMIN";
export type BookingStatus = "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED" | "FAILED";
export type CarCategory = "ECONOMY" | "COMPACT" | "SUV" | "LUXURY" | "SPORTS" | "VAN" | "ELECTRIC";
export type Transmission = "AUTOMATIC" | "MANUAL";
export type FuelType = "PETROL" | "DIESEL" | "HYBRID" | "ELECTRIC";
export type DiscountType = "PERCENT" | "FIXED";
export type ApplicationStatus = "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  seats: number;
  transmission: Transmission;
  fuelType: FuelType;
  mileage?: number | null;
  color: string;
  description: string;
  features: string[];
  images: string[];
  modelUrl?: string | null;
  available: boolean;
  locationId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  pickupLocationId?: string | null;
  dropoffLocationId?: string | null;
  totalDays: number;
  subtotalPrice: number;
  discountAmount: number;
  totalPrice: number;
  promoCode?: string | null;
  promoCodeId?: string | null;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  method?: string | null;
  status: PaymentStatus;
  stripeId?: string | null;
  paidAt?: Date | null;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  carId: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  minRentalDays?: number | null;
  maxUses?: number | null;
  usedCount: number;
  validFrom: Date;
  validUntil?: Date | null;
  isActive: boolean;
  requiresWishlist: boolean;
  firstBookingOnly: boolean;
  createdAt: Date;
}

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  position: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  portfolioUrl?: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

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

export type WishlistDraft = {
  startDate: string;
  endDate: string;
  pickupLocationId?: string;
  dropoffLocationId?: string;
  bookingNotes?: string;
};

export type WishlistItem = {
  id: string;
  carId: string;
  note: string | null;
  savedAt: string | Date;
  updatedAt: string | Date;
  draft: WishlistDraft | null;
  car: CarWithRelations;
};

export type PromoPreview = {
  code: string;
  description: string;
  discountAmount: number;
  subtotal: number;
  totalPrice: number;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
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
  promoCode?: string;
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

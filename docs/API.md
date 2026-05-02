# VeloRent — API Reference

All endpoints are Next.js Route Handlers under `/api/`. Base URL: `http://localhost:3000` (dev) or your production domain.

## Response Format

Every endpoint returns the same envelope:

```json
// Success
{ "success": true, "data": { ... } }

// Success (paginated)
{
  "success": true,
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 12, "total": 45, "totalPages": 4 }
}

// Error
{ "success": false, "error": "Human-readable message", "code": "ERROR_CODE" }
```

---

## Authentication

### POST `/api/auth/register`

Create a new user account.

**Auth:** Public

**Body:**
```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "SecurePass1",
  "confirmPassword": "SecurePass1"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "Alice Johnson", "email": "alice@example.com", "role": "USER" }
}
```

**Errors:** `VALIDATION_ERROR` (400), `EMAIL_EXISTS` (409)

---

### POST `/api/auth/[...nextauth]`

NextAuth handler. Handles sign-in, sign-out, session, and OAuth callbacks. See [NextAuth docs](https://authjs.dev).

---

## Cars

### GET `/api/cars`

List cars with optional filters and pagination.

**Auth:** Public

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `category` | `CarCategory` | Filter by category (ECONOMY, SUV, LUXURY, etc.) |
| `minPrice` | `number` | Minimum price per day |
| `maxPrice` | `number` | Maximum price per day |
| `startDate` | `ISO string` | Availability start date |
| `endDate` | `ISO string` | Availability end date |
| `city` | `string` | Filter by location city (case-insensitive) |
| `transmission` | `AUTOMATIC \| MANUAL` | Filter by transmission |
| `fuelType` | `FuelType` | Filter by fuel type |
| `seats` | `number` | Minimum number of seats |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Results per page (default: 12, max: 50) |
| `sort` | `price_asc \| price_desc \| rating \| newest` | Sort order (default: newest) |

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "Lamborghini Huracán EVO",
      "brand": "Lamborghini",
      "model": "Huracán EVO",
      "year": 2023,
      "category": "SPORTS",
      "pricePerDay": 899,
      "seats": 2,
      "transmission": "AUTOMATIC",
      "fuelType": "PETROL",
      "color": "Arancio Borealis",
      "images": ["https://..."],
      "available": true,
      "averageRating": 4.8,
      "location": { "city": "Los Angeles", ... },
      "_count": { "reviews": 12 }
    }
  ],
  "pagination": { "page": 1, "limit": 12, "total": 15, "totalPages": 2 }
}
```

---

### POST `/api/cars`

Create a new car.

**Auth:** ADMIN only

**Body:**
```json
{
  "name": "Ferrari 488 GTB",
  "brand": "Ferrari",
  "model": "488 GTB",
  "year": 2022,
  "category": "SPORTS",
  "pricePerDay": 799,
  "seats": 2,
  "transmission": "AUTOMATIC",
  "fuelType": "PETROL",
  "mileage": 8000,
  "color": "Rosso Corsa",
  "description": "A masterpiece of performance...",
  "features": ["Carbon Ceramic Brakes", "Bose Sound"],
  "images": ["https://cloudinary.com/..."],
  "modelUrl": "/models/ferrari.glb",
  "available": true,
  "locationId": "clx..."
}
```

**Response `201`:** Created car object.

**Errors:** `UNAUTHORIZED` (401), `VALIDATION_ERROR` (400)

---

### GET `/api/cars/[id]`

Get a single car with full details and reviews.

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "...",
    "reviews": [
      {
        "id": "...",
        "rating": 5,
        "comment": "Incredible car!",
        "user": { "id": "...", "name": "Alice", "avatar": null },
        "createdAt": "2026-01-15T..."
      }
    ],
    "averageRating": 4.8,
    "_count": { "reviews": 3 }
  }
}
```

**Errors:** `NOT_FOUND` (404)

---

### PATCH `/api/cars/[id]`

Update a car. All fields are optional.

**Auth:** ADMIN only

**Body:** Any subset of the car creation fields.

**Response `200`:** Updated car object.

---

### DELETE `/api/cars/[id]`

Delete a car.

**Auth:** ADMIN only

**Response `200`:** `{ "success": true, "data": null }`

---

### GET `/api/cars/[id]/availability`

Get booked date ranges for a car (for disabling dates in the date picker).

**Auth:** Public

**Response `200`:**
```json
{
  "success": true,
  "data": [
    { "start": "2026-06-01T00:00:00.000Z", "end": "2026-06-05T00:00:00.000Z" },
    { "start": "2026-06-10T00:00:00.000Z", "end": "2026-06-12T00:00:00.000Z" }
  ]
}
```

---

## Bookings

### GET `/api/bookings`

List bookings. Users see only their own. Admins see all.

**Auth:** Authenticated

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | `BookingStatus` | Filter by status |
| `page` | `number` | Page number |
| `limit` | `number` | Results per page (default: 10) |

**Response `200`:** Paginated list of bookings with car, user, locations, payment, review included.

---

### POST `/api/bookings`

Create a new booking.

**Auth:** Authenticated

**Body:**
```json
{
  "carId": "clx...",
  "startDate": "2026-06-15T00:00:00.000Z",
  "endDate": "2026-06-18T00:00:00.000Z",
  "pickupLocationId": "clx...",
  "dropoffLocationId": "clx...",
  "notes": "Please have the car ready by 9am"
}
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "totalDays": 3,
    "totalPrice": 2697,
    "status": "PENDING",
    "paymentStatus": "UNPAID",
    ...
  }
}
```

**Errors:** `VALIDATION_ERROR` (400), `CAR_UNAVAILABLE` (400), `DATE_CONFLICT` (409)

---

### GET `/api/bookings/[id]`

Get a single booking with full details.

**Auth:** Owner or ADMIN

**Response `200`:** Full booking object with car, user, locations, payment, review.

**Errors:** `NOT_FOUND` (404), `FORBIDDEN` (403)

---

### PATCH `/api/bookings/[id]`

Update booking status or notes.

**Auth:** Owner (can only set `CANCELLED`) or ADMIN (any status)

**Body:**
```json
{ "status": "CANCELLED" }
```

**Response `200`:** Updated booking object.

---

### DELETE `/api/bookings/[id]`

Hard delete a booking.

**Auth:** ADMIN only

---

## Payments

### POST `/api/payments/create-intent`

Create a Stripe PaymentIntent for a booking.

**Auth:** Booking owner

**Body:**
```json
{ "bookingId": "clx..." }
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_..._secret_...",
    "paymentIntentId": "pi_..."
  }
}
```

**Errors:** `NOT_FOUND` (404), `FORBIDDEN` (403), `ALREADY_PAID` (400)

---

### POST `/api/payments/webhook`

Stripe webhook handler. Called by Stripe — do not call directly.

**Auth:** Stripe signature verification (HMAC)

**Handled events:**
- `payment_intent.succeeded` → Booking confirmed, email sent
- `payment_intent.payment_failed` → Booking payment marked failed
- `charge.refunded` → Booking cancelled, payment refunded

---

## Reviews

### GET `/api/reviews`

Get reviews, optionally filtered by car.

**Auth:** Public

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `carId` | `string` | Filter reviews for a specific car |

**Response `200`:** Array of reviews with user info.

---

### POST `/api/reviews`

Submit a review for a completed booking.

**Auth:** Authenticated (must own the booking, booking must be COMPLETED)

**Body:**
```json
{
  "carId": "clx...",
  "bookingId": "clx...",
  "rating": 5,
  "comment": "Absolutely incredible experience!"
}
```

**Response `201`:** Created review with user info.

**Errors:** `NOT_FOUND` (404), `BOOKING_NOT_COMPLETED` (400), `REVIEW_EXISTS` (409)

---

## Upload

### POST `/api/upload`

Upload an image to Cloudinary.

**Auth:** ADMIN only

**Body:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | `File` | Image file (JPEG, PNG, WebP, GIF) or `.glb` model |
| `folder` | `string` | Cloudinary folder (default: `velorent/cars`) |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "velorent/cars/abc123"
  }
}
```

---

## Profile

### GET `/api/profile`

Get the current user's profile.

**Auth:** Authenticated

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "USER",
    "phone": null,
    "avatar": null,
    "_count": { "bookings": 3, "reviews": 2 }
  }
}
```

---

### PATCH `/api/profile`

Update profile info or change password.

**Auth:** Authenticated

**Body (profile update):**
```json
{ "name": "Alice Smith", "phone": "+1 555 000 0000" }
```

**Body (password change):**
```json
{
  "currentPassword": "OldPass1",
  "newPassword": "NewPass1"
}
```

**Errors:** `INVALID_PASSWORD` (400), `VALIDATION_ERROR` (400)

---

## Admin

### GET `/api/admin/stats`

Dashboard KPIs and revenue chart data.

**Auth:** ADMIN only

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 48500,
    "monthlyRevenue": 12300,
    "totalBookings": 87,
    "todayBookings": 3,
    "activeRentals": 5,
    "totalCars": 15,
    "availableCars": 12,
    "totalUsers": 42,
    "newUsersThisMonth": 8,
    "revenueData": [
      { "month": "Dec 25", "revenue": 8200, "bookings": 14 },
      { "month": "Jan 26", "revenue": 9100, "bookings": 16 },
      ...
    ]
  }
}
```

---

### GET `/api/admin/users`

List all users.

**Auth:** ADMIN only

**Query Parameters:** `page`, `limit`, `search` (name or email)

**Response `200`:** Paginated list of users with booking/review counts.

---

### PATCH `/api/admin/users/[id]`

Update a user's role or info.

**Auth:** ADMIN only

**Body:**
```json
{ "role": "ADMIN" }
```

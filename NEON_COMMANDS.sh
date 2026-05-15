#!/bin/bash
# VeloRent + Neon Setup Commands
# Copy and paste each section into your terminal

# ============================================
# PRE-FLIGHT: Verify installation
# ============================================

# Check Node.js installed
node --version

# Check npm installed
npm --version

# Check Prisma installed
npx prisma --version

echo "✓ All dependencies present"


# ============================================
# STEP 1: Get Neon Pooled Connection String
# ============================================

# 1. Go to https://console.neon.tech
# 2. Click your project → Select database "velorent"
# 3. Click "Connection Details" → Select "Pooler" (not "Direct")
# 4. Copy the entire URL (should end with "?sslmode=require")
#
# Example: postgresql://neondb_owner:abc123xyz@ep-cool-cloud-12345-pooler.neon.tech/velorent?sslmode=require


# ============================================
# STEP 2: Generate NEXTAUTH_SECRET
# ============================================

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output (32-character hex string)


# ============================================
# STEP 3: Fill .env.local
# ============================================

# Open .env.local in your project root
# Replace these placeholders with values from above:
#
# DATABASE_URL="paste-your-neon-pooled-url-here"
# NEXTAUTH_SECRET="paste-your-generated-secret-here"
# NEXTAUTH_URL="http://localhost:3000"


# ============================================
# STEP 4: Apply Schema to Neon
# ============================================

cd c:\Users\Ehab\velorent

npx prisma migrate deploy

# Expected: "All migrations have been successfully applied"


# ============================================
# STEP 5: Seed Demo Data (optional)
# ============================================

npm run db:seed

# Expected: "Seeding complete"
# You now have:
# - 1 admin user (admin@velorent.com / Admin1234!)
# - 5 test users (alice@example.com / User1234!, etc.)
# - 15 cars with images
# - 10 bookings
# - 5 locations


# ============================================
# STEP 6: Start Development Server
# ============================================

npm run dev

# App runs at http://localhost:3000
# Press Ctrl+C to stop


# ============================================
# VERIFICATION: Test Everything Works
# ============================================

# In browser after "npm run dev":

# 1. Cars page:
#    → Go to http://localhost:3000/cars
#    → Should see 15 cars with filters

# 2. Admin login:
#    → Click "Sign In"
#    → Email: admin@velorent.com
#    → Password: Admin1234!
#    → Should log in successfully

# 3. Admin dashboard:
#    → After login, go to http://localhost:3000/admin
#    → Should see stats, users, bookings

# 4. Regular user login:
#    → Sign out
#    → Login with: alice@example.com / User1234!
#    → Browse cars, make booking

# ✓ If all tests pass, you're done!


# ============================================
# TROUBLESHOOTING COMMANDS
# ============================================

# Check migration status:
npx prisma migrate status

# Open database admin UI:
npx prisma studio

# Rebuild Prisma client:
npx prisma generate

# Full reset (destructive!):
npx prisma migrate reset

# View Prisma logs:
PRISMA_QUERY_LOG_LEVEL=debug npm run dev

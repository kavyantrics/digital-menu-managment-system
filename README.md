# Digital Menu Management System

A full-stack web application for managing restaurant menus with QR code sharing capabilities, built using the T3 Stack.

## 🚀 Live Demo

**Vercel Deployment:** "https://digital-menu-managment-system.vercel.app/dashboard"

## 📋 Project Overview

This application allows restaurant owners to:

- Register and manage their profile
- Create and manage multiple restaurants
- Organize menus with categories and dishes
- Share menus via QR codes or direct links
- View public menus with a modern, responsive interface

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (hosted on Neon.com)
- **ORM:** Prisma
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **API:** tRPC
- **Authentication:** Custom JWT-based session management
- **Email Service:** Resend
- **Deployment:** Vercel

## 🏗️ Approach to Solving the Problem

### 1. **Architecture Design**

- Implemented a feature-by-feature approach, starting with authentication, then user management, restaurant management, and finally menu management
- Used tRPC for type-safe API communication between client and server
- Separated concerns with clear router structure (auth, user, restaurant, menu, public-menu)

### 2. **Authentication Strategy**

- Skipped NextAuth as per requirements and implemented custom JWT-based authentication
- Email verification flow: Request code → Verify code → Create session
- Session management using HTTP-only cookies for security
- Implemented a Promise-based mechanism to handle session token synchronization between tRPC mutations and Next.js Route Handlers

### 3. **Database Design**

- Designed normalized schema with proper relationships:
  - User → Restaurant (one-to-many)
  - Restaurant → Category (one-to-many)
  - Restaurant → Dish (one-to-many)
  - Dish ↔ Category (many-to-many via DishCategory)
- Added proper indexes for performance
- Implemented cascade deletes for data integrity

### 4. **UI/UX Implementation**

- Used shadcn/ui components exclusively for consistency
- Implemented responsive design with Tailwind CSS
- Created reusable component patterns
- Added loading states, error handling, and empty states throughout
- Implemented QR code generation for menu sharing

### 5. **Code Quality**

- Removed all unnecessary template code
- Ensured consistent naming conventions
- Implemented comprehensive error handling
- Added proper TypeScript types throughout
- Cleaned up debug statements and console logs

## 💻 Development Environment

**IDE:** Cursor (AI-powered code editor)

## 🤖 AI Tools and Models Used

- **Primary Tool:** Cursor AI (Auto agent router)
- **Models:** Various models accessed through Cursor's AI integration
- **Usage:** Code generation, refactoring, debugging, and optimization

## 📝 Key Prompts Used with AI Tools

1. **Initial Setup:**
   - "Build a Digital Menu Management System using T3 Stack, Prisma, PostgreSQL, shadcn/ui, and Vercel. Skip NextAuth and build feature by feature."

2. **Authentication Fixes:**
   - "Check the implementation again, verify if it is implemented correctly, if not fix it."
   - "Find an alternative to setup this auth, change the approach, make it working"

3. **UI Improvements:**
   - "Make the UI better, fix the alignment issue, make button better editable and user friendly."
   - "Fix the UI of the login page"

4. **Code Optimization:**
   - "Now let's optimize the code, clean all the logs and debug, and create reusable component instead of writing multiple and changing everywhere"
   - "For all the component/ui use only shadcn, don't create manual or anything. use shadcn and then can modify a bit for UI"

5. **Code Quality:**
   - "Iterate and follow this and see if this also aligns" (referring to code quality criteria)

## ✅ AI Tool Helpfulness and Corrections

### **Helpful Aspects:**

- **Rapid Prototyping:** AI significantly accelerated initial feature development
- **Pattern Recognition:** Helped identify and implement consistent patterns across the codebase
- **Refactoring:** Efficiently refactored code to use shadcn components
- **Error Debugging:** Assisted in debugging complex session management issues
- **Code Cleanup:** Helped identify and remove unnecessary code

### **Mistakes Identified and Corrected:**

1. **Session Cookie Persistence:**
   - **Issue:** Initial implementation couldn't reliably persist session cookies in Next.js Route Handlers
   - **Correction:** Implemented Promise-based token synchronization mechanism
   - **Lesson:** Understanding Next.js 15 Route Handler cookie handling limitations

2. **Custom Components vs shadcn:**
   - **Issue:** Initially created custom components instead of using shadcn
   - **Correction:** Replaced all custom components with shadcn equivalents
   - **Lesson:** Always check if shadcn has the component before creating custom ones

3. **Template Code Leftovers:**
   - **Issue:** postRouter and LatestPost component from T3 template remained unused
   - **Correction:** Removed all unused template code
   - **Lesson:** Always audit for unused code after initial setup

4. **Environment Variables:**
   - **Issue:** NEXTAUTH_URL remained in env.js despite not using NextAuth
   - **Correction:** Removed unused environment variable
   - **Lesson:** Clean up environment variables that aren't actually used

5. **Linter False Positives:**
   - **Issue:** Linter suggested `bg-linear-to-br` instead of `bg-gradient-to-br`
   - **Correction:** Identified as false positive - `bg-gradient-to-br` is correct Tailwind CSS
   - **Lesson:** Verify linter suggestions before applying them

## 🛡️ Edge Cases and Error Scenarios Handled

### **Authentication:**

- ✅ Invalid verification codes
- ✅ Expired verification codes
- ✅ User not found during verification
- ✅ Email validation
- ✅ Session expiration handling
- ✅ Unauthorized access to protected routes
- ✅ Logout functionality with proper cookie deletion

### **Data Operations:**

- ✅ Empty states for restaurants, categories, and dishes
- ✅ Loading states for all async operations
- ✅ Error handling with user-friendly messages
- ✅ Restaurant ownership verification before operations
- ✅ Null/undefined checks for optional fields (e.g., `dish.spiceLevel ?? 0`)
- ✅ Safe array operations with optional chaining
- ✅ Form validation before submission
- ✅ Disabled buttons during mutations to prevent double submissions

### **UI/UX:**

- ✅ Responsive design for mobile and desktop
- ✅ Loading indicators during data fetching
- ✅ Error messages displayed with Alert components
- ✅ Empty state messages with helpful CTAs
- ✅ Form reset after successful submissions
- ✅ Navigation guards (redirect to login if not authenticated)

### **Public Menu:**

- ✅ Restaurant not found handling
- ✅ Empty categories handling
- ✅ Empty dishes in categories
- ✅ QR code generation for menu sharing
- ✅ Menu link copying functionality
- ✅ Scroll-based category highlighting
- ✅ Smooth scrolling to categories

### **Data Integrity:**

- ✅ Cascade deletes (deleting restaurant deletes categories and dishes)
- ✅ Unique constraints (email, dish-category relationships)
- ✅ Proper indexing for performance
- ✅ Transaction safety in database operations

## ⚠️ Edge Cases Identified but Not Handled (Due to Time Constraints)

### **1. Email Delivery Failures**

- **Issue:** If Resend API fails, user doesn't get verification code
- **Current State:** Error is logged but user sees generic error message
- **Future Solution:**
  - Implement retry mechanism with exponential backoff
  - Add fallback email service
  - Show more specific error messages
  - Add manual code resend option

### **2. Rate Limiting**

- **Issue:** No rate limiting on verification code requests
- **Current State:** Users can spam verification code requests
- **Future Solution:**
  - Implement rate limiting (e.g., max 3 requests per email per 10 minutes)
  - Add IP-based rate limiting
  - Use Redis or similar for rate limit tracking

### **3. Image Upload**

- **Issue:** Dish images are stored as URLs (no actual upload functionality)
- **Current State:** Users must provide external image URLs
- **Future Solution:**
  - Integrate image upload service (e.g., Cloudinary, AWS S3)
  - Add image validation (size, format, dimensions)
  - Implement image optimization and CDN

### **4. Verification Code Expiration**

- **Issue:** Verification codes don't expire
- **Current State:** Codes remain valid indefinitely
- **Future Solution:**
  - Add expiration timestamp (e.g., 10 minutes)
  - Clear expired codes automatically
  - Show expiration countdown in UI

### **5. Concurrent Edits**

- **Issue:** No handling for concurrent edits to same restaurant/menu
- **Current State:** Last write wins (potential data loss)
- **Future Solution:**
  - Implement optimistic locking
  - Add conflict resolution UI
  - Use database transactions with proper isolation levels

### **6. Large Menu Performance**

- **Issue:** No pagination for restaurants with many categories/dishes
- **Current State:** All data loaded at once
- **Future Solution:**
  - Implement pagination or infinite scroll
  - Add virtual scrolling for large lists
  - Implement lazy loading for images

### **7. Offline Support**

- **Issue:** No offline functionality
- **Current State:** Requires active internet connection
- **Future Solution:**
  - Implement service workers
  - Add local storage caching
  - Queue actions for when connection is restored

### **8. Accessibility**

- **Issue:** Limited ARIA labels and keyboard navigation
- **Current State:** Basic accessibility
- **Future Solution:**
  - Add comprehensive ARIA labels
  - Improve keyboard navigation
  - Add screen reader support
  - Conduct accessibility audit

### **9. Error Recovery**

- **Issue:** Limited error recovery mechanisms
- **Current State:** Users must refresh or retry manually
- **Future Solution:**
  - Implement automatic retry for transient errors
  - Add error boundary components
  - Implement error reporting/logging service

### **10. Data Export/Import**

- **Issue:** No way to export or import menu data
- **Current State:** Manual data entry only
- **Future Solution:**
  - Add CSV/JSON export functionality
  - Implement bulk import from CSV
  - Add template downloads

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon.com recommended)
- Resend API key for email functionality

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd digital-menu-managment-system
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `RESEND_API_KEY` - Resend API key for emails
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- `NEXT_PUBLIC_APP_URL` - Your app URL (optional, for production)

4. Set up the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:seed` - Seed the database with sample data with the email you are supposed to login
- `npm run db:studio` - Open Prisma Studio

## 📖 Learn More

- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [tRPC Documentation](https://trpc.io/docs)

## 📄 License

This project is created for assignment purposes.

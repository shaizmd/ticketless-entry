# Ticketless Entry

A modern, full-stack Next.js application for seamless, paperless monument ticket booking. Users can browse monuments, book tickets, receive QR code-based digital tickets, and manage their bookings—all with a crisp, compact UI and secure backend.

---

## 🚀 Features

- **Browse Monuments:** View a curated list of monuments with images, ratings, and details.
- **Instant Booking:** Multi-step booking form with date, time, guest count, and user details.
- **Convenience Fee:** Transparent 5% fee calculation included in total price.
- **Digital Tickets:** Secure QR code generated for each booking, scannable at entry.
- **PDF Download:** Download your ticket as a PDF for offline access.
- **My Bookings:** View all your bookings in one place, with quick access to QR codes.
- **Admin Panel:** Add new monuments with images and details (admin only).
- **Authentication:** Secure sign-in/sign-up with Clerk.
- **Consistent UI:** Compact, light-weight, and mobile-friendly design using Tailwind CSS.

---

## 📝 Booking Flow

1. **Browse:**
   - Explore monuments on the home or monuments page.
2. **Select & Book:**
   - Choose a monument, pick a date, time, and number of guests.
   - Enter your details and review the transparent pricing (including convenience fee).
3. **Confirm:**
   - Submit your booking. Receive a unique QR code and PDF ticket on the success page.
4. **Access Bookings:**
   - View all your bookings and tickets in the "My Bookings" section.
5. **Entry:**
   - Show your QR code at the monument for quick, paperless entry.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL
- **Auth:** Clerk
- **QR & PDF:** qrcode, jsPDF

---

## Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## 📂 Project Structure

- `app/` — Main application pages and components
- `app/monuments/` — Monument listing, details, and booking
- `app/my-bookings/` — User's booking history
- `app/admin/` — Admin panel for monument management
- `prisma/` — Database schema and migrations
- `lib/` — Prisma client setup

---

## License

MIT

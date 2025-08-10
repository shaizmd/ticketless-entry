import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Ticket, QrCode } from "lucide-react";
import { prisma } from "@/lib/prisma";

type Booking = {
  id: string;
  monumentId: string;
  userName: string;
  userEmail: string;
  bookingDate: Date;
  pax: number;
  totalAmount: number;
  createdAt: Date;
  monument: {
    id: string;
    name: string;
    location: string;
  };
};

export default async function MyBookingsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  let bookings: Booking[] = [];
  try {
    bookings = await prisma.bookings.findMany({
      include: {
        monument: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link 
            href="/monuments" 
            className="flex items-center space-x-2 text-slate-600 hover:text-orange-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Monuments</span>
          </Link>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            My Bookings
          </h1>
          <p className="text-slate-600">
            View and manage your monument bookings
          </p>
        </div>

        {/* Filter by current user's email - this is a temporary solution */}
        {/* In production, you should store the Clerk user ID in the bookings table */}
        <BookingsList bookings={bookings} />
      </div>
    </div>
  );
}

async function BookingsList({ bookings }: { bookings: Booking[] }) {
  const user = await currentUser();
  
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-200/60">
          <p className="text-slate-600">Please sign in to view your bookings.</p>
        </div>
      </div>
    );
  }

  const userEmail = user.emailAddresses[0].emailAddress;
  const userBookings = bookings.filter(booking => booking.userEmail === userEmail);

  if (userBookings.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">No Bookings Yet</h3>
          <p className="text-slate-600 text-sm mb-4">Start exploring our amazing monuments!</p>
          <Link
            href="/monuments"
            className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-500 transition-colors"
          >
            Explore Monuments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-4">
        {userBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-200/60 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Booking Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {booking.monument.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-slate-800">₹{booking.totalAmount}</div>
                    <div className="text-xs text-slate-500">#{booking.id.slice(-6).toUpperCase()}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                  <div>
                    <span className="block font-medium">Date</span>
                    <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Time</span>
                    <span>{new Date(booking.bookingDate).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}</span>
                  </div>
                  <div>
                    <span className="block font-medium">Guests</span>
                    <span>{booking.pax} people</span>
                  </div>
                </div>
              </div>

              {/* QR Code Button */}
              <div className="ml-6">
                <Link
                  href={`/monuments/${booking.monumentId}/booking-success?bookingId=${booking.id}`}
                  className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-500 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR Code</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { CheckCircle, Calendar, Users, MapPin, ArrowLeft, QrCode, Ticket, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QRCodeGenerator from "./components/QRCodeGenerator";
import PDFDownloader from "./components/PDFDownloader";

interface BookingSuccessPageProps {
  searchParams: {
    bookingId?: string;
  };
}

export default async function BookingSuccessPage({ searchParams }: BookingSuccessPageProps) {
  const { bookingId } = searchParams;
  
  let booking = null;
  let monument = null;

  if (bookingId) {
    try {
      booking = await prisma.bookings.findUnique({
        where: { id: bookingId },
        include: {
          monument: true,
        },
      });
      
      if (!booking) {
        notFound();
      }
      
      monument = booking.monument;
    } catch (error) {
      console.error("Error fetching booking:", error);
      notFound();
    }
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

      {/* Success Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute inset-0 w-16 h-16 bg-green-400 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <h1 className="text-2xl font-light text-slate-800 mb-3 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
            Your monument tour has been successfully booked. Get ready for an amazing experience!
          </p>
        </div>

        {booking && monument ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/60">
              {/* Header */}
              <div className="flex items-center justify-center space-x-2 mb-5">
                <Ticket className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-medium text-slate-800">Your Booking</h2>
              </div>

              {/* Main Content - QR and Details Side by Side */}
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* QR Code Section */}
                <div className="text-center">
                  <QRCodeGenerator bookingId={booking.id} size={140} />
                  <div className="mt-3 text-xs text-slate-600">
                    #{booking.id.slice(-8).toUpperCase()}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monument:</span>
                    <span className="font-medium text-slate-800">{monument.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(booking.bookingDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Guests:</span>
                    <span className="font-medium text-slate-800">{booking.pax} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-800">{booking.userName}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-3">
                    <span className="text-slate-600 font-medium">Total:</span>
                    <span className="font-semibold text-slate-800">₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-5 pt-4 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600 mb-3 font-light">Present QR code at entrance • Arrive 15 minutes early</p>
                <PDFDownloader booking={booking} />
              </div>
            </div>
          </div>
        ) : (
          /* Fallback if no booking data */
          <div className="max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-200/60 text-center">
              <h2 className="text-xl font-medium text-slate-800 mb-4">Booking Details</h2>
              <div className="bg-slate-50/70 backdrop-blur-sm rounded-xl p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-slate-600">Booking confirmation sent to your email</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-slate-600">Booking reference number will be provided</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span className="text-slate-600">Meeting point details included in email</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 max-w-md mx-auto">
          <Link
            href="/monuments"
            className="flex-1 bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-500 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 text-center"
          >
            Explore More Monuments
          </Link>
          <Link
            href="/"
            className="flex-1 bg-slate-200/70 backdrop-blur-sm text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-300/70 transition-all duration-200 text-center"
          >
            Return to Home
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-light">
            Need assistance? Contact us at{" "}
            <a href="mailto:support@monuments.com" className="text-orange-600 font-medium hover:underline">
              support@monuments.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

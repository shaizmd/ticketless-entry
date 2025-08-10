import { prisma } from "@/lib/prisma";
import { Image } from "@imagekit/next";
import BookingForm from "./BookingForm";
import { notFound } from "next/navigation";
import { MapPin, Star, Calendar, Clock, Users, Camera, ArrowLeft, Share2, Heart } from "lucide-react";
import Link from "next/link";

interface MonumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function MonumentDetailsPage({ params }: MonumentPageProps) {
  const { id } = await params;
  const monument = await prisma.monuments.findUnique({
    where: { id },
  });

  if (!monument) return notFound();

  const renderStars = (rating: number) => {
    const validRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const fullStars = Math.max(0, Math.floor(validRating));
    const hasHalfStar = validRating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <div className="flex items-center space-x-1">
        {fullStars > 0 && [...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-5 h-5 text-slate-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {emptyStars > 0 && [...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-slate-300" />
        ))}
        <span className="ml-2 text-base font-medium text-slate-700">{validRating}</span>
        <span className="text-slate-500 text-sm ml-1">(1,247 reviews)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation Bar */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/monuments" 
              className="flex items-center space-x-2 text-slate-600 hover:text-amber-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Monuments</span>
            </Link>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-slate-200/60 transition-all duration-200 hover:scale-105">
                <Share2 className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm border border-slate-200/60 transition-all duration-200 hover:scale-105">
                <Heart className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="relative mb-4">
          <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/60">
            <Image
              urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
              src={monument.imageUrl}
              width={1200}
              height={600}
              alt={monument.name}
              transformation={[{ width: 1200, height: 600 }]}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* Title and Basic Info */}
        <div className="mb-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-200/60">
            <h1 className="text-2xl sm:text-3xl font-light text-slate-800 mb-3 tracking-tight">
              {monument.name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-5 h-5 text-orange-600" />
                <span className="text-base font-light">{monument.location}</span>
              </div>
              {renderStars(monument.rating)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/60 text-center">
                <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-slate-800 font-medium text-sm">Duration</p>
                <p className="text-slate-600 text-xs font-light">2-3 hours</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/60 text-center">
                <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-slate-800 font-medium text-sm">Group Size</p>
                <p className="text-slate-600 text-xs font-light">Up to 15 people</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/60 text-center">
                <Camera className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-slate-800 font-medium text-sm">Photography</p>
                <p className="text-slate-600 text-xs font-light">Allowed</p>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-200/60">
              <h2 className="text-lg font-medium text-slate-800 mb-3">About This Monument</h2>
              <p className="text-slate-700 leading-relaxed font-light text-sm">
                {monument.description}
              </p>
            </div>

            {/* What's Included Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-200/60">
              <h2 className="text-lg font-medium text-slate-800 mb-3">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Professional guided tour",
                  "Entry tickets included", 
                  "Historical information",
                  "Photo opportunities",
                  "Small group experience",
                  "Local insights"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span className="text-slate-700 font-light text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section - Removed for compact design */}

          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-200/60">
                <div className="mb-5">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-2xl font-light text-slate-800">₹500</span>
                    <span className="text-slate-500 font-light text-sm">per person</span>
                  </div>
                  <p className="text-xs text-slate-600 font-light">Free cancellation up to 24 hours</p>
                </div>
                
                <BookingForm monumentId={monument.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

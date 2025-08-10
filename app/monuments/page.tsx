import { MapPin, Star, Calendar, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Image } from '@imagekit/next';
import MonumentCard from './components/MonumentCard';

// Monument type definition
export interface Monument {
  id: string;
  name: string;
  location: string;
  rating: number;
  imageUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

//fetch monuments from the database
export default async function MonumentsPage() {
  const monuments = await prisma.monuments.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-light text-slate-800 mb-4 tracking-tight">
            Discover Monuments
          </h1>
          <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto">
            Explore the world's most magnificent historical sites and architectural wonders
          </p>
        </div>

        {/* Monument Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {monuments.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-16">
              <p className="text-lg">No monuments found.</p>
              <p className="text-sm mt-2">Add some monuments to see them here.</p>
            </div>
          ) : (
            monuments.map((monument) => (
              <MonumentCard key={monument.id} monument={monument} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
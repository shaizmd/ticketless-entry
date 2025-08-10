"use client";
import { MapPin, Star, Calendar, ArrowRight } from 'lucide-react';
import { Image } from '@imagekit/next';
import { useRouter } from 'next/navigation';
import type { Monument } from '../page';

interface MonumentCardProps {
  monument: Monument;
}

export default function MonumentCard({ monument }: MonumentCardProps) {
  const router = useRouter();

  const truncateText = (text: string, lines = 3): string => {
    const words = text.split(' ');
    const wordsPerLine = 12; // Approximate words per line
    const maxWords = lines * wordsPerLine;
    
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
  };

  const renderStars = (rating: number) => {
    // Ensure rating is a valid number between 0 and 5
    const validRating = Math.max(0, Math.min(5, Number(rating) || 0));
    
    const fullStars = Math.max(0, Math.floor(validRating));
    const hasHalfStar = validRating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    return (
      <div className="flex items-center space-x-1">
        {/* Full stars */}
        {fullStars > 0 && [...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-slate-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {emptyStars > 0 && [...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-slate-300" />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-600">{validRating}</span>
      </div>
    );
  };

  const handleMonumentBooking = () => {
    router.push(`/monuments/${monument.id}`);
  };

  return (
    <div className="group relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
          src={monument.imageUrl}
          width={1000}
          height={1000}
          alt={monument.name}
          transformation={[{ width: 500, height: 500 }]}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors duration-300">
            {monument.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-slate-500">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-light">{monument.location}</span>
            </div>
            {renderStars(monument.rating)}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed font-light">
          {truncateText(monument.description, 2)}
        </p>

        {/* Action Button */}
        <div className="pt-3">
          <button 
            className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-orange-500 transition-all duration-300 shadow-sm hover:shadow-md group-hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            onClick={handleMonumentBooking}
          >
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Book Experience</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

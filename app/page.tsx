'use client';
import React from 'react';
import { QrCode, MapPin, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const monuments = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9
  },
  {
    id: 2,
    name: "Red Fort",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1705861144413-f02e38354648?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVkJTIwZm9ydHxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.6
  }
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://plus.unsplash.com/premium_photo-1661963952208-2db3512ef3de?q=80&w=1244&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-4xl md:text-5xl lg:text-7xl font-light mb-4 sm:mb-6">
            Skip the Queue.
            <span className="block">Scan & Enter.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 font-light">
            Book monument tickets online and get instant QR code access
          </p>
          <Link href="/monuments">
          <button className="bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-200 ease-in-out shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer">
            Book Tickets Now
          </button>
          </Link>

        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-8 sm:mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {[
              { icon: MapPin, title: "Select Monument", desc: "Choose your destination" },
              { icon: QrCode, title: "Get QR Code", desc: "Book and receive instant QR" },
              { icon: ArrowRight, title: "Enter", desc: "Scan at gate and enter" }
            ].map((step, index) => (
              <div key={index} className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monuments */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-8 sm:mb-12 text-gray-800">
            Popular Monuments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {monuments.map((monument) => (
              <div key={monument.id} className="bg-white rounded-2xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg hover:-translate-y-2 duration-300 ease-out">
                <img src={monument.image} alt={monument.name} className="w-full h-40 sm:h-48 object-cover" />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-800">{monument.name}</h3>
                  <div className="flex items-center text-gray-500 mb-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-sm sm:text-base font-light">{monument.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm sm:text-base text-gray-600 font-light">{monument.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
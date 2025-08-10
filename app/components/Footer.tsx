"use client"
import React from 'react';
import { QrCode, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <QrCode className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-medium">Ticketless Entry</span>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-3 font-light">
              Revolutionizing heritage tourism with digital convenience and sustainable practices.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
             <a href="#" className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-pink-600 hover:via-orange-400 hover:to-yellow-400 transition-all">
                <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
              <a href="#" className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors">
                <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors font-light">Popular Monuments</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors font-light">How It Works</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors font-light">Support</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors font-light">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-medium mb-3">Get Updates</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-3 font-light">Subscribe to get the latest updates on new monuments and offers.</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base font-light"
              />
              <button className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none hover:bg-orange-600 transition-colors text-sm sm:text-base font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-xs sm:text-sm text-gray-400 font-light">
            © 2025 Ticketless Entry. All rights reserved. Preserving heritage, embracing technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
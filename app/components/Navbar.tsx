"use client";
import React from 'react';
import Link from 'next/link';
import { QrCode, Menu, X } from 'lucide-react';
import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

interface NavbarProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-black/20 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <QrCode className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className={`text-lg sm:text-xl font-medium transition-colors ${isScrolled ? 'text-gray-800' : 'text-black'}`}>Ticketless Entry</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link href="/" className={`transition-colors text-sm lg:text-base font-light ${isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-black hover:text-orange-300'}`}>Home</Link>
            <Link href="/admin/upload-monument" className={`transition-colors text-sm lg:text-base font-light ${isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-black hover:text-orange-300'}`}>Admin</Link>
            <Link href="/monuments" className={`transition-colors text-sm lg:text-base font-light ${isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-black hover:text-orange-300'}`}>Monuments</Link>
            <SignedIn>
              <Link href="/my-bookings" className={`transition-colors text-sm lg:text-base font-light ${isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-black hover:text-orange-300'}`}>My Bookings</Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`text-left px-3 lg:px-4 py-2 rounded-lg border transition-colors text-sm lg:text-base font-light ${isScrolled ? 'text-gray-700 border-gray-300 hover:text-orange-500 hover:bg-gray-50' : 'text-white border-white/30 hover:text-orange-300 hover:bg-white/10'}`}>Login</button>
                </SignInButton>
              </SignedOut>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-orange-500 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer text-sm lg:text-base font-medium">
                    Sign In
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className='flex items-center ml-2 lg:ml-4'>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-orange-500 ring-offset-2 hover:ring-orange-400 transition-all" } }} />
                </div>
              </SignedIn>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden mt-3 sm:mt-4 pb-3 sm:pb-4 border-t pt-3 sm:pt-4 ${isScrolled ? 'border-gray-200' : 'border-white/20'}`}>
            <nav className="flex flex-col space-y-3 sm:space-y-4">
              <div className='flex flex-col space-y-3 sm:space-y-4'>
              <Link href="/" className={`transition-colors text-sm sm:text-base font-light ${isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white hover:text-orange-300'}`}>Home</Link>
              <Link href="/monuments" className={`transition-colors text-sm sm:text-base font-light ${isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white hover:text-orange-300'}`}>Monuments</Link>
              <SignedIn>
                <Link href="/my-bookings" className={`transition-colors text-sm sm:text-base font-light ${isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white hover:text-orange-300'}`}>My Bookings</Link>
              </SignedIn>
              </div>
                <SignedIn>
                <div className='flex items-center mt-1'>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-orange-500 ring-offset-2 hover:ring-orange-400 transition-all" } }} />
                </div>
              </SignedIn>
             <SignedOut>
              <SignInButton mode="modal">
                  <button className={`text-center px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm sm:text-base font-light ${isScrolled ? 'text-gray-700 border-gray-300 hover:text-orange-500 hover:bg-gray-50' : 'text-white border-white/30 hover:text-orange-300 hover:bg-white/10'}`}>Login</button>
                </SignInButton>
              </SignedOut>
               <SignedOut>
                <SignUpButton mode="modal">
                  <button className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer text-sm sm:text-base font-medium">
                    Sign In
                  </button>
                </SignUpButton>
              </SignedOut>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

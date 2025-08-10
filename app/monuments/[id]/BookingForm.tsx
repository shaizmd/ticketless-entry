"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Clock, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { createBooking } from './actions';

interface BookingFormProps {
  monumentId: string;
}

export default function BookingForm({ monumentId }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStep, setBookingStep] = useState(1); // 1: Date/Time, 2: Details, 3: Payment
  const [error, setError] = useState('');
  
  const router = useRouter();

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('monumentId', monumentId);
      formData.append('userName', `${firstName} ${lastName}`);
      formData.append('userEmail', email);
      formData.append('bookingDate', selectedDate);
      formData.append('bookingTime', selectedTime);
      formData.append('pax', numberOfPeople.toString());
      formData.append('totalAmount', totalPrice.toString());

      const result = await createBooking(formData);
      
      if (result.success && result.booking) {
        router.push(`/monuments/${monumentId}/booking-success?bookingId=${result.booking.id}`);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pricing calculations
  const ticketPrice = numberOfPeople * 500;
  const convenienceFee = Math.ceil(ticketPrice * 0.05); // 5% convenience fee, rounded up
  const totalPrice = ticketPrice + convenienceFee;

  if (bookingStep === 1) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); setBookingStep(2); }} className="space-y-4">
        {/* Date Selection */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-800">
            <Calendar className="w-4 h-4 mr-2 text-orange-600" />
            Select Date
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 transition-all duration-200 text-sm hover:border-slate-300 focus:bg-white backdrop-blur-sm"
            required
          />
        </div>

        {/* Time Selection */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-800">
            <Clock className="w-4 h-4 mr-2 text-orange-600" />
            Select Time
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`p-2 text-xs rounded-lg border transition-all duration-200 ${
                  selectedTime === time
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white/50 text-slate-700 border-slate-200/60 hover:border-orange-300 hover:bg-orange-50/50 backdrop-blur-sm'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Number of People */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-slate-800">
            <Users className="w-4 h-4 mr-2 text-orange-600" />
            Number of People
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
              className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:border-orange-400 transition-colors duration-200 text-sm font-medium"
            >
              −
            </button>
            <span className="text-lg font-medium text-slate-800 min-w-[2.5rem] text-center">
              {numberOfPeople}
            </span>
            <button
              type="button"
              onClick={() => setNumberOfPeople(Math.min(15, numberOfPeople + 1))}
              className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:border-orange-400 transition-colors duration-200 text-sm font-medium"
            >
              +
            </button>
          </div>
          <p className="text-xs text-slate-600 font-light">Maximum 15 people per booking</p>
        </div>

        {/* Price Summary */}
        <div className="bg-orange-50/70 backdrop-blur-sm rounded-xl p-3 border border-orange-200/60">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Ticket Price (₹500 × {numberOfPeople})</span>
              <span className="font-medium">₹{ticketPrice}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Convenience Fee</span>
              <span className="font-medium">₹{convenienceFee}</span>
            </div>
            <div className="border-t border-orange-200/60 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-medium text-sm">Total Amount</span>
                <span className="text-xl font-light text-orange-700">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedDate || !selectedTime}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-3 rounded-xl text-sm font-medium hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Continue to Details
        </button>
      </form>
    );
  }

  if (bookingStep === 2) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); setBookingStep(3); }} className="space-y-4">
        {/* Booking Summary */}
        <div className="bg-slate-50/70 backdrop-blur-sm rounded-xl p-3 border border-slate-200/60">
          <h3 className="font-medium text-slate-800 mb-2 text-sm">Booking Summary</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Date:</span>
              <span className="font-medium">{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Time:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">People:</span>
              <span className="font-medium">{numberOfPeople}</span>
            </div>
            <div className="border-t border-slate-200/60 pt-1 mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Ticket Price:</span>
                <span className="font-medium">₹{ticketPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Convenience Fee:</span>
                <span className="font-medium">₹{convenienceFee}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 pt-1">
                <span className="font-medium">Total:</span>
                <span className="font-medium text-orange-600">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-medium text-slate-800 text-sm">Contact Information</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-800">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 border border-slate-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 transition-all duration-200 text-sm backdrop-blur-sm"
                  placeholder="John"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-800">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/50 border border-slate-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 transition-all duration-200 text-sm backdrop-blur-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-800">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-slate-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-500 transition-all duration-200 text-sm backdrop-blur-sm"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setBookingStep(1)}
            className="flex-1 bg-slate-200/70 backdrop-blur-sm text-slate-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-300/70 transition-all duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!firstName || !lastName || !email}
            className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-3 rounded-xl text-sm font-medium hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50/70 backdrop-blur-sm border border-red-200/60 rounded-xl p-3">
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
      {/* Payment Summary */}
      <div className="bg-slate-50/70 backdrop-blur-sm rounded-xl p-3 border border-slate-200/60">
        <h3 className="font-medium text-slate-800 mb-2 text-sm">Final Summary</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-600">Experience:</span>
            <span className="font-medium">Monument Tour</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Date & Time:</span>
            <span className="font-medium">{selectedDate} at {selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Guests:</span>
            <span className="font-medium">{numberOfPeople} people</span>
          </div>
          <div className="border-t border-slate-200/60 pt-1 mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-600">Ticket Price:</span>
              <span className="font-medium">₹{ticketPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Convenience Fee (5%):</span>
              <span className="font-medium">₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/60 pt-1">
              <span className="font-medium">Total Amount:</span>
              <span className="font-medium text-orange-600 text-sm">₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className="flex items-center font-medium text-slate-800 text-sm">
          <CreditCard className="w-4 h-4 mr-2 text-orange-600" />
          Payment Information
        </h3>
        
        <div className="bg-orange-50/70 backdrop-blur-sm rounded-xl p-3 border border-orange-200/60">
          <p className="text-sm text-slate-700 font-medium mb-1">Secure Payment Processing</p>
          <p className="text-xs text-slate-600 font-light">
            Payment will be processed securely through our payment gateway after confirmation.
          </p>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50/70 backdrop-blur-sm border border-green-200/60 rounded-xl p-3">
        <div className="flex items-start space-x-2">
          <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-green-800">Secure Payment</p>
            <p className="text-xs text-green-600 mt-0.5 font-light">
              Your payment information is encrypted and secure. Free cancellation up to 24 hours before your visit.
            </p>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          required
          className="mt-0.5 w-3 h-3 text-orange-600 focus:ring-orange-500 border-slate-300 rounded"
        />
        <label className="text-xs text-slate-600 font-light">
          I agree to the <span className="text-orange-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-orange-600 hover:underline cursor-pointer">Privacy Policy</span>
        </label>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setBookingStep(2)}
          className="flex-1 bg-slate-200/70 backdrop-blur-sm text-slate-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-300/70 transition-all duration-200"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-4 py-3 rounded-xl text-sm font-medium hover:from-orange-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex items-center justify-center space-x-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Proceed to Payment</span>
              </>
            )}
          </div>
        </button>
      </div>
    </form>
  );
}

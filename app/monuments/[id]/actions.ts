"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const BookingSchema = z.object({
  monumentId: z.string().min(1, "Monument ID is required"),
  userName: z.string().min(1, "Name is required"),
  userEmail: z.string().email("Valid email is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
  pax: z.coerce.number().min(1, "At least 1 person is required").max(15, "Maximum 15 people allowed"),
  totalAmount: z.coerce.number().min(1, "Total amount is required"),
});

export async function createBooking(formData: FormData) {
  try {
    const rawData = {
      monumentId: formData.get("monumentId"),
      userName: formData.get("userName"),
      userEmail: formData.get("userEmail"),
      bookingDate: formData.get("bookingDate"),
      bookingTime: formData.get("bookingTime"),
      pax: formData.get("pax"),
      totalAmount: formData.get("totalAmount"),
    };

    const validatedData = BookingSchema.parse(rawData);

    // Combine date and time into a proper DateTime
    const bookingDateTime = new Date(`${validatedData.bookingDate}T${convertTo24Hour(validatedData.bookingTime)}`);

    const booking = await prisma.bookings.create({
      data: {
        monumentId: validatedData.monumentId,
        userName: validatedData.userName,
        userEmail: validatedData.userEmail,
        bookingDate: bookingDateTime,
        pax: validatedData.pax,
        totalAmount: validatedData.totalAmount,
      },
    });

    return { success: true, booking };
  } catch (error) {
    console.error("Booking creation error:", error);
    return { 
      success: false, 
      error: error instanceof z.ZodError 
        ? error.issues[0].message 
        : "Failed to create booking. Please try again."
    };
  }
}

// Helper function to convert 12-hour format to 24-hour format
function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = (parseInt(hours, 10) + 12).toString();
  }
  
  return `${hours}:${minutes}:00`;
}

"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const monumentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Invalid image URL"),
  location: z.string().min(1, "Location is required"),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
});

export async function addMonument(prevState: any, formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    location: formData.get("location"),
    rating: formData.get("rating"),
  };

  const parsed = monumentSchema.safeParse(raw);
  
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { success: false, errors };
  }

  try {
    const monument = await prisma.monuments.create({
      data: parsed.data,
    });
    
    return { success: true, monument, errors: {} };
  } catch (error) {
    console.error("Error saving monument:", error);
    return { 
      success: false, 
      errors: { formError: ["Failed to create monument."] },
      monument: null 
    };
  }
}
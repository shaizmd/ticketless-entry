"use client";
import React, { useState, useRef } from 'react';
import { X, Plus, MapPin, Star, FileText } from 'lucide-react';
import UploadExample from '../../components/UploadImage';
import { addMonument } from '@/actions/monument';

// Form state interface matching server action response
interface FormState {
  errors?: {
    name?: string[];
    description?: string[];
    location?: string[];
    rating?: string[];
    imageUrl?: string[];
    formError?: string[];
  };
  success?: boolean;
  monument?: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    location: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

const initialState: FormState = { 
  errors: {}, 
  success: false, 
  monument: null 
};

export default function AddMonumentPage() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Handle form submission with proper FormData including imageUrl
  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    // Add the imageUrl from state to FormData
    if (imageUrl) {
      formData.set('imageUrl', imageUrl);
    }
    
    // Call the server action
    const result = await addMonument(formState, formData);
    setFormState(result);
    setIsSubmitting(false);
  };

  // Reset form after successful submission
  React.useEffect(() => {
    if (formState.success && formRef.current) {
      formRef.current.reset();
      setImageUrl('');
    }
  }, [formState.success]);

  return(
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-20 pb-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800 mb-2 tracking-tight">
            Add New Monument
          </h1>
          <p className="text-slate-500 font-light">
            Preserve history for future generations
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 sm:p-8">
          {/* Success Message */}
          {formState.success && formState.monument && (
            <div className="mb-6 p-4 bg-green-50/80 border border-green-200/60 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-green-800 font-medium text-sm">Success</p>
                  <p className="text-green-700 text-sm font-light">
                    Monument "{formState.monument.name}" has been added successfully
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Error */}
          {formState.errors?.formError && (
            <div className="mb-6 p-4 bg-red-50/80 border border-red-200/60 rounded-xl backdrop-blur-sm">
              {formState.errors.formError.map((error, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-red-800 font-medium text-sm">Error</p>
                    <p className="text-red-700 text-sm font-light">{error}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form ref={formRef} action={handleSubmit} className="space-y-4">
            {/* Monument Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-800">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Monument Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Taj Mahal"
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-500 transition-all duration-200 ${
                  formState.errors?.name 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                }`}
              />
              {formState.errors?.name && (
                <div className="space-y-1">
                  {formState.errors.name.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm flex items-center font-light">
                      <X className="w-4 h-4 mr-1" />
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-800">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief description of the monument and its historical significance..."
                rows={4}
                className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-500 transition-all duration-200 resize-none ${
                  formState.errors?.description 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                }`}
              />
              {formState.errors?.description && (
                <div className="space-y-1">
                  {formState.errors.description.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm flex items-center font-light">
                      <X className="w-4 h-4 mr-1" />
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Location and Rating Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-800">
                  <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                  Location
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g. Agra, India"
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-500 transition-all duration-200 ${
                    formState.errors?.location 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                  }`}
                />
                {formState.errors?.location && (
                  <div className="space-y-1">
                    {formState.errors.location.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm flex items-center font-light">
                        <X className="w-4 h-4 mr-1" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="rating" className="flex items-center text-sm font-medium text-gray-800">
                  <Star className="w-4 h-4 mr-2 text-orange-500" />
                  Rating (1-5)
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  defaultValue="4.3"
                  placeholder="4.3"
                  step="0.1"
                  min="1"
                  max="5"
                  className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-500 transition-all duration-200 ${
                    formState.errors?.rating 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300 focus:bg-white'
                  }`}
                />
                {formState.errors?.rating && (
                  <div className="space-y-1">
                    {formState.errors.rating.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm flex items-center font-light">
                        <X className="w-4 h-4 mr-1" />
                        {error}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-800">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Monument Image
                <span className="text-red-500 ml-1">*</span>
              </label>
              <UploadExample setImageUrl={setImageUrl} />
              
              {/* Show image URL when available */}
              {imageUrl && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">✓ Image uploaded successfully</p>
                  <p className="text-xs text-green-600 mt-1 break-all font-light">{imageUrl}</p>
                </div>
              )}
              
              {formState.errors?.imageUrl && (
                <div className="space-y-1">
                  {formState.errors.imageUrl.map((error, index) => (
                    <p key={index} className="text-red-500 text-sm flex items-center font-light">
                      <X className="w-4 h-4 mr-1" />
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-sm"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>
                    {isSubmitting ? 'Adding Monument...' : 'Add Monument'}
                  </span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
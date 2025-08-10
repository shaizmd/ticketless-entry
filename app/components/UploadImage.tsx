"use client";

import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";

interface UploadExampleProps {
    setImageUrl: (url: string) => void;
}

const UploadExample: React.FC<UploadExampleProps> = ({ setImageUrl }) => {
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            throw new Error("Authentication request failed");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (20MB limit for ImageKit)
            const maxSize = 20 * 1024 * 1024; // 20MB in bytes
            if (file.size > maxSize) {
                alert(`File size too large. Please select an image smaller than 20MB. Current size: ${formatFileSize(file.size)}`);
                // Reset the input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file (PNG, JPG, JPEG, WebP, etc.)');
                // Reset the input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            setSelectedFile(file);
            setProgress(0);
            setUploadSuccess(false);
        }
    };

    const triggerFileSelect = () => {
        if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const removeFile = () => {
        setSelectedFile(null);
        setProgress(0);
        setIsUploading(false);
        setUploadSuccess(false);
        setImageUrl(''); // Clear the image URL in parent component
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload");
            return;
        }

        // Double-check file size before upload
        const maxSize = 20 * 1024 * 1024; // 20MB in bytes
        if (selectedFile.size > maxSize) {
            alert(`File size too large. Please select an image smaller than 20MB. Current size: ${formatFileSize(selectedFile.size)}`);
            return;
        }

        setIsUploading(true);
        setProgress(0);

        const abortController = new AbortController(); // Move here where it's used

        try {
            const authParams = await authenticator();
            const { signature, expire, token, publicKey } = authParams;

            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file: selectedFile,
                fileName: selectedFile.name,
                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.signal,
            });
            
            setUploadSuccess(true);
            
            // Update the parent component with the uploaded image URL
            if (uploadResponse.url) {
                setImageUrl(uploadResponse.url);
            } else {
                throw new Error('No URL returned from upload');
            }
        } catch (error) {
            console.error('Upload error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Unknown error occurred';
            if (error instanceof ImageKitAbortError) {
                errorMessage = 'Upload was cancelled';
            } else if (error instanceof ImageKitInvalidRequestError) {
                errorMessage = error.message;
            } else if (error instanceof ImageKitUploadNetworkError) {
                errorMessage = 'Network error - please check your connection';
            } else if (error instanceof ImageKitServerError) {
                errorMessage = 'Server error - please try again later';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            alert(`Upload failed: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            {!selectedFile ? (
                <div className="relative group">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div 
                        onClick={triggerFileSelect}
                        className="flex items-center justify-between p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                    >
                        <div className="flex items-center space-x-3 pointer-events-none">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Upload className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Choose monument image</p>
                                <p className="text-sm text-gray-500">PNG, JPG up to 20MB</p>
                            </div>
                        </div>
                        <span className="text-gray-500 text-sm pointer-events-none">No file chosen</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className={`flex items-center justify-between p-4 border-2 rounded-xl ${
                        uploadSuccess 
                            ? 'bg-gradient-to-r from-green-50 to-orange-50 border-green-200' 
                            : 'bg-gray-50 border-gray-200'
                    }`}>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <ImageIcon className={`w-5 h-5 ${uploadSuccess ? 'text-green-600' : 'text-orange-500'}`} />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{selectedFile.name}</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                                    {selectedFile.size > 15 * 1024 * 1024 && selectedFile.size <= 20 * 1024 * 1024 && (
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Large file</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-gray-700">
                                <span>Upload progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    
                    {!uploadSuccess && !isUploading && (
                        <button
                            type="button"
                            onClick={handleUpload}
                            className="w-full bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <Upload className="w-4 h-4" />
                                <span>Upload Image</span>
                            </div>
                        </button>
                    )}
                    
                    {uploadSuccess && (
                        <div className="text-center py-2">
                            <p className="text-green-600 font-medium">✓ Upload successful!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadExample;
export { UploadExample };
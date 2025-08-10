"use client";

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  bookingId: string;
  size?: number;
}

export default function QRCodeGenerator({ bookingId, size = 200 }: QRCodeGeneratorProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true);
        
        const qrData = JSON.stringify({
          bookingId: bookingId,
          type: 'MONUMENT_BOOKING',
          timestamp: Date.now(),
          checksum: generateChecksum(bookingId)
        });

        const dataURL = await QRCode.toDataURL(qrData, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          margin: 1,
          color: {
            dark: '#1f2937',
            light: '#ffffff',
          },
          width: size,
        });

        setQrCodeDataURL(dataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingId) {
      generateQRCode();
    }
  }, [bookingId, size]);

  const generateChecksum = (bookingId: string): string => {
    let hash = 0;
    for (let i = 0; i < bookingId.length; i++) {
      const char = bookingId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).slice(0, 8);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center" style={{ height: size, width: size }}>
        <div className="w-full h-full bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-slate-400 text-sm">Generating...</div>
        </div>
      </div>
    );
  }

  if (!qrCodeDataURL) {
    return (
      <div className="flex justify-center items-center" style={{ height: size, width: size }}>
        <div className="w-full h-full bg-red-50 rounded-lg flex items-center justify-center">
          <div className="text-red-500 text-sm text-center">
            Failed to generate QR code
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
        <img 
          src={qrCodeDataURL} 
          alt={`QR Code for booking ${bookingId}`}
          className="object-contain"
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  );
}

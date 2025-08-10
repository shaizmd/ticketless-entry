"use client";

import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

interface PDFDownloaderProps {
  booking: {
    id: string;
    userName: string;
    userEmail: string;
    bookingDate: Date;
    pax: number;
    totalAmount: number;
    monument: {
      name: string;
      location: string;
    };
  };
}

export default function PDFDownloader({ booking }: PDFDownloaderProps) {
  const generatePDF = async () => {
    try {
      const qrData = JSON.stringify({
        bookingId: booking.id,
        type: 'MONUMENT_BOOKING',
        timestamp: Date.now(),
      });
      
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'H',
        width: 150,
        margin: 1,
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFillColor(249, 115, 22);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MONUMENT TICKET', pageWidth / 2, 25, { align: 'center' });
      
      pdf.setTextColor(0, 0, 0);
      
      // Booking Reference
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Booking Reference:', 20, 60);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`#${booking.id.slice(-8).toUpperCase()}`, 70, 60);
      
      // Monument Information
      pdf.setFont('helvetica', 'bold');
      pdf.text('Monument:', 20, 75);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.monument.name, 45, 75);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Location:', 20, 85);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.monument.location, 45, 85);
      
      // Booking Details
      pdf.setFont('helvetica', 'bold');
      pdf.text('Guest Name:', 20, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.userName, 55, 100);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Email:', 20, 110);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.userEmail, 35, 110);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Date & Time:', 20, 120);
      pdf.setFont('helvetica', 'normal');
      const dateTime = `${new Date(booking.bookingDate).toLocaleDateString()} at ${new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`;
      pdf.text(dateTime, 55, 120);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Number of People:', 20, 130);
      pdf.setFont('helvetica', 'normal');
      pdf.text(booking.pax.toString(), 70, 130);
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Amount:', 20, 140);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`₹${booking.totalAmount}`, 55, 140);
      
      // QR Code
      pdf.addImage(qrCodeDataURL, 'PNG', pageWidth - 60, 60, 40, 40);
      pdf.setFontSize(10);
      pdf.text('Scan for Entry', pageWidth - 60, 110, { align: 'left' });
      
      // Instructions
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 160, pageWidth - 20, 160);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Instructions:', 20, 175);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const instructions = [
        '• Please arrive 15 minutes before your scheduled time',
        '• Show this ticket and the QR code at the entrance',
        '• Valid ID may be required for verification',
        '• This ticket is non-transferable and non-refundable',
        '• Contact support@monuments.com for any assistance'
      ];
      
      instructions.forEach((instruction, index) => {
        pdf.text(instruction, 20, 185 + (index * 8));
      });
      
      // Footer
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Generated on: ' + new Date().toLocaleString(), 20, pageHeight - 20);
      pdf.text('Thank you for choosing our monument experience!', pageWidth / 2, pageHeight - 20, { align: 'center' });
      
      pdf.save(`monument-ticket-${booking.id.slice(-8)}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <button 
      onClick={generatePDF}
      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
    >
      <Download className="w-4 h-4" />
      <span>Download PDF Ticket</span>
    </button>
  );
}
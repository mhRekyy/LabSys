import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lab } from "./types";
import BookingForm from "./BookingForm";
import { BookingItem } from "@/components/dashboard/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface LabBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLab: Lab | null;
  onBookingSubmit: (data: any) => void;
}

const LabBookingDialog: React.FC<LabBookingDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedLab,
  onBookingSubmit
}) => {
  const navigate = useNavigate();
  
  const handleBookingSubmit = (data: any) => {
    if (!selectedLab) return;

    // Create a new booking
    const newBooking: BookingItem = {
      id: Date.now(),
      lab: selectedLab.name,
      equipment: data.equipment || "General access",
      date: data.date,
      time: data.timeSlot,
      status: "confirmed"
    };

    // Get existing bookings or initialize empty array
    const existingBookings = localStorage.getItem('userBookings');
    const bookings = existingBookings ? JSON.parse(existingBookings) : [];
    
    // Add new booking
    const updatedBookings = [...bookings, newBooking];
    
    // Save to localStorage
    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
    
    // Close dialog and show success message
    onOpenChange(false);
    toast.success("Booking created successfully!");
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {selectedLab?.name}</DialogTitle>
          <DialogDescription>
            Select date and time for your laboratory session
          </DialogDescription>
        </DialogHeader>
        {selectedLab && (
          <BookingForm lab={selectedLab} onSubmit={handleBookingSubmit} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LabBookingDialog;
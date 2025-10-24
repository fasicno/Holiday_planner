"use client"

import { useState } from 'react';
import type { Hotel } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

type BookingFormProps = {
  hotel: Hotel;
  searchParams?: { [key: string]: string | undefined };
};

export function BookingForm({ hotel, searchParams }: BookingFormProps) {
  const { toast } = useToast();
  const [isBooked, setIsBooked] = useState(false);

  const fromDate = searchParams?.from;
  const toDate = searchParams?.to;
  const guests = searchParams?.guests ?? 1;

  const calculateNights = () => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diff = end.getTime() - start.getTime();
      return Math.round(diff / (1000 * 60 * 60 * 24));
    }
    return 1;
  };
  
  const nights = calculateNights();
  const pricePerNight = hotel.pricePerNight;
  const serviceFee = 25;
  const taxes = (pricePerNight * nights) * 0.1;
  const total = (pricePerNight * nights) + serviceFee + taxes;

  const handleBooking = () => {
    setIsBooked(true);
    toast({
      title: "Booking Confirmed!",
      description: `Your stay at ${hotel.name} is booked.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">
          <span className="font-bold">${hotel.pricePerNight}</span>
          <span className="text-base font-normal text-muted-foreground"> / night</span>
        </CardTitle>
        {fromDate && toDate && (
             <CardDescription>
                Dates: {new Date(fromDate).toLocaleDateString()} - {new Date(toDate).toLocaleDateString()}
            </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between">
                <span>${pricePerNight} x {nights} {nights === 1 ? 'night' : 'nights'}</span>
                <span>${(pricePerNight * nights).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span className="text-muted-foreground">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span className="text-muted-foreground">${taxes.toFixed(2)}</span>
            </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Book Now
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Booking</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to book a {nights}-night stay at {hotel.name} for a total of ${total.toFixed(2)}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handleBooking}>
                    Confirm & Book
                </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}

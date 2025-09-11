'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { createBooking, fetchCar, updateCarAvailability } from '../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Car } from '../types/car';

const schema = z.object({
  startDate: z.string()
    .refine((val) => val !== '', { message: 'Start date is required' })
    .refine((val) => !isNaN(new Date(val).getTime()), { message: 'Invalid start date' }),
  endDate: z.string()
    .refine((val) => val !== '', { message: 'End date is required' })
    .refine((val) => !isNaN(new Date(val).getTime()), { message: 'Invalid end date' })
    .refine((val) => new Date(val) > new Date(), { message: 'End date must be in the future' }),
});

type FormData = z.input<typeof schema>;

export default function BookingForm({ carId }: { carId: string }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: '', endDate: '' },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // Calculate total days and price
  const calculateBookingDetails = () => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        days: diffDays,
        totalPrice: diffDays * car.price
      };
    }
    return null;
  };

  const bookingDetails = calculateBookingDetails();

  const onSubmit = async (data: FormData) => {
    if (!user?.uid) {
      setError('You must be logged in to book a car');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Convert form data to the expected format for createBooking
      const bookingData = {
        userId: user.uid,
        carId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };
      
      await fetchCar(carId);
      setCar(car);
      
      if(car && !car.availability){
        setError('Car is not available for booking');
        return;
      } else {
        if(await createBooking(bookingData)){
          await updateCarAvailability(carId, false);
          setSuccess(true);
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to create booking: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-green-200 rounded-2xl p-6 mt-6 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-gray-800 text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Your car has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => window.location.href = '/bookings'}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6 shadow-lg">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-gray-800 text-xl font-semibold">Book This Vehicle</h3>
        </div>
        <p className="text-gray-500 text-sm">
          Select your rental dates to proceed with the booking
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pick-up Date
          </label>
          <div className="relative">
            <input
              type="date"
              {...register('startDate')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {errors.startDate && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Date
          </label>
          <div className="relative">
            <input
              type="date"
              {...register('endDate')}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          {errors.endDate && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.endDate.message}
            </p>
          )}
        </div>

        {/* Booking Summary */}
        {bookingDetails && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-gray-800 font-medium mb-3 flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Booking Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Rental Duration:</span>
                <span className="text-gray-800 font-medium">{bookingDetails.days} day{bookingDetails.days !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Daily Rate:</span>
                <span className="text-gray-800 font-medium">${car?.price || 0}</span>
              </div>
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="text-green-600 text-lg">${bookingDetails.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Auth Warning */}
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-yellow-800 text-sm font-medium">Login Required</p>
              <p className="text-yellow-700 text-sm mt-1">You must be logged in to book a car.</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!user || isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02] flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Book Now
            </>
          )}
        </button>
      </form>
    </div>
  );
}
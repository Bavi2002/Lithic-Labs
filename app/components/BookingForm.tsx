'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { createBooking, fetchCar, updateCarAvailability } from '../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Car } from '../types/car';
import { FaRegCalendarCheck } from 'react-icons/fa6';

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
          
          <h3 className="text-gray-800 text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Your car has been successfully booked. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => window.location.href = '/bookings'}
            className="bg-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
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
            <FaRegCalendarCheck className='w-5 h-5 text-green-600' />
          </div>
          <h3 className="text-gray-800 text-xl font-semibold">Book This Vehicle</h3>
        </div>
        <p className="text-gray-500 text-sm">
          Select your rental dates to proceed with the booking
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pick-up Date
          </label>
          <div className="relative">
            <input
              type="date"
              {...register('startDate')}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200"
            />
           
          </div>
          {errors.startDate && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
             
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Date
          </label>
          <div className="relative">
            <input
              type="date"
              {...register('endDate')}
              min={startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200"
            />
           
          </div>
          {errors.endDate && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              
              {errors.endDate.message}
            </p>
          )}
        </div>

       

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
            
            <div>
              <p className="text-yellow-800 text-sm font-medium">Login Required</p>
              <p className="text-yellow-700 text-sm mt-1">You must be logged in to book a car.</p>
            </div>
          </div>
        )}

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
              
              Book Now
            </>
          )}
        </button>
      </form>
    </div>
  );
}
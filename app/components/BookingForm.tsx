'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { createBooking } from '../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { startDate: '', endDate: '' }, // Initialize with empty strings
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.uid) {
      setError('You must be logged in to book a car');
      return;
    }

    try {
      // Convert form data to the expected format for createBooking
      const bookingData = {
        userId: user.uid,
        carId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      };
      await createBooking(bookingData);
      alert('Booking successful!');
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Failed to create booking: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div>
        <input
          type="date"
          {...register('startDate')}
          className="w-full p-2 border rounded"
        />
        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
      </div>
      <div>
        <input
          type="date"
          {...register('endDate')}
          className="w-full p-2 border rounded"
        />
        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        disabled={!user}
      >
        Book Now
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
}
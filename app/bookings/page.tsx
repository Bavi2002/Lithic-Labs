'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Booking } from '../types/booking';
import { fetchBookings, fetchCar } from '../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Car } from '../types/car';

export default function Bookings() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    if (user?.uid) {
      const loadBookings = async () => {
        try {
          setLoading(true);
          const data = await fetchBookings(user.uid);
          setBookings(data);
          const car: Car = await fetchCar(data[0].carId);
          setCar(car);
          console.log(data);
        } catch (err) {
            console.error(err);
          setError('Failed to load bookings');
        } finally {
          setLoading(false);
        }
      };
      loadBookings();
    }
  }, [user?.uid]);

  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-4">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((booking) => (
             <li key={booking.id} className="border p-2">
  Car: {car?.name} |{" "}
  {new Date(booking.startDate._seconds * 1000).toLocaleDateString()} to{" "}
  {new Date(booking.endDate._seconds * 1000).toLocaleDateString()}
  Total: ${car ? ((booking.endDate._seconds - booking.startDate._seconds) / 86400) * car.price : 0}
</li>

            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
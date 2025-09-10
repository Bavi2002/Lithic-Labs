'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Booking } from '../types/booking';
import { fetchBookings } from '../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Bookings() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      const loadBookings = async () => {
        try {
          setLoading(true);
          const data = await fetchBookings(user.uid);
          setBookings(data);
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
                Car: {booking.carId} | {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
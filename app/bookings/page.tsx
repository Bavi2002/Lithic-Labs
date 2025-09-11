'use client';
import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { Booking } from '../types/booking';
import { fetchBookings, fetchCar } from '../lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Car } from '../types/car';
import Link from 'next/link';

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
          if (data.length > 0) {
            const car: Car = await fetchCar(data[0].carId);
            setCar(car);
          }
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


   if (loading) {
    return (
      <ProtectedRoute>
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">

            <p className="text-gray-700 text-lg font-medium">Loading car details...</p>
        </div>
      </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl  border p-8 transform hover:scale-105 transition-transform duration-200">
            
            <h2 className="text-gray-900 text-xl font-bold mb-3">Something went wrong</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
      </ProtectedRoute>
    );
  }


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="bg-white  border-b border-green-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
             
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                My <span className="text-600 ">Bookings</span>
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Track and manage your car reservations
              </p>
            </div>
          </div>
        </div>

]        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
              
                <h3 className="text-gray-900 text-2xl font-bold mb-4">No bookings yet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  You haven&apos;t made any car reservations yet. Start exploring our premium collection!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center bg-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  
                  Browse Cars
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Reservations</h2>
                
              </div>

              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                  >
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between relative">
                      <div className="flex-1 mb-6 lg:mb-0">
                        <div className="flex items-start space-x-4 mb-6">
                          
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {car?.name || 'Car Information Loading...'}
                            </h3>
                            <p className="text-gray-500 font-medium">Booking ID: {booking.id}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-100 rounded-2xl p-4">
                            <div className="flex items-center mb-3">
                            
                              <h4 className="font-semibold text-gray-900">Rental Period</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm">Start Date:</span>
                                <span className="font-semibold text-gray-900">
                                  {new Date(booking.startDate._seconds * 1000).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm">End Date:</span>
                                <span className="font-semibold text-gray-900">
                                  {new Date(booking.endDate._seconds * 1000).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-100 rounded-2xl p-4">
                            <div className="flex items-center mb-3">
                             
                              <h4 className="font-semibold text-gray-900">Booking Details</h4>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm">Duration:</span>
                                <span className="font-semibold text-gray-900">
                                  {Math.ceil((booking.endDate._seconds - booking.startDate._seconds) / 86400)} days
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm">Status:</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

=                      <div className="lg:ml-8 lg:flex-shrink-0">
                        <div className="bg-green-100 rounded-2xl p-6 text-center border border-green-200 lg:w-48">
                          <p className="text-green-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Amount</p>
                          <div className="flex items-baseline justify-center mb-4">
                            <span className="text-3xl font-black text-gray-900">
                              ${car ? Math.ceil(((booking.endDate._seconds - booking.startDate._seconds) / 86400) * car.price) : '---'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Rate per day:</span>
                              <span className="font-medium">${car?.price || '---'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

    
      </div>
    </ProtectedRoute>
  );
}
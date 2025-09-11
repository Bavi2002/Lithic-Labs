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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-100 border-t-green-500 mb-6 shadow-lg"></div>
              <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-green-100">
              <p className="text-gray-700 text-lg font-medium">Loading your bookings...</p>
              <div className="mt-3 flex justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-8 transform hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-gray-900 text-xl font-bold mb-3">Something went wrong</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                My <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Bookings</span>
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Track and manage your car reservations
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {bookings.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-gray-900 text-2xl font-bold mb-4">No bookings yet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  You haven&apos;t made any car reservations yet. Start exploring our premium collection!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Browse Cars
                </Link>
              </div>
            </div>
          ) : (
            /* Bookings List */
            <div>
              {/* Results Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Reservations</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-600 font-medium">
                    {bookings.length} active booking{bookings.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Bookings Grid */}
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/5 to-green-600/5 rounded-full -translate-y-16 translate-x-16"></div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between relative">
                      <div className="flex-1 mb-6 lg:mb-0">
                        {/* Car Info */}
                        <div className="flex items-start space-x-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center border border-green-200">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {car?.name || 'Car Information Loading...'}
                            </h3>
                            <p className="text-gray-500 font-medium">Booking ID: {booking.id}</p>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Dates */}
                          <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
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

                          {/* Duration & Status */}
                          <div className="bg-gray-50 rounded-2xl p-4">
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
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

                      {/* Price Section */}
                      <div className="lg:ml-8 lg:flex-shrink-0">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border border-green-200 lg:w-48">
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

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-100">
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-xl transition-all duration-200 text-sm">
                        View Details
                      </button>
                      <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-sm">
                        Cancel Booking
                      </button>
                      <button className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-xl transition-all duration-200 border border-green-200 hover:border-green-300 text-sm">
                        Modify Dates
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import BookingForm from '../../components/BookingForm';
import { Car } from '../../types/car';
import { fetchCar } from '../../lib/api';

export default function CarDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const loadCar = async () => {
        try {
          setLoading(true);
          const data = await fetchCar(id as string);
          setCar(data);
        } catch (err) {
          console.error(err);
          setError('Failed to load car');
        } finally {
          setLoading(false);
        }
      };
      loadCar();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-white text-lg">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-white text-2xl font-bold mb-2">Oops!</h2>
            <p className="text-red-400 mb-6">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push('/')} 
                className="w-full bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              >
                Back to Cars
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8">
            <div className="text-slate-400 text-6xl mb-4">🚗</div>
            <h2 className="text-white text-2xl font-bold mb-2">Car Not Found</h2>
            <p className="text-slate-400 mb-6">
              The car you're looking for doesn't exist or may have been removed.
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Browse All Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header with Back Button */}
      <div className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors duration-200 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cars
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Car Header */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="mb-6 lg:mb-0 lg:flex-1">
              {/* Car Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {car.name} <span className="text-green-400">- {car.model}</span>
              </h1>

              {/* Availability Badge */}
              <div className="flex items-center mb-6">
                <span 
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    car.availability 
                      ? 'bg-green-900/50 text-green-400 border border-green-500/30' 
                      : 'bg-red-900/50 text-red-400 border border-red-500/30'
                  }`}
                >
                  <span 
                    className={`w-2 h-2 rounded-full mr-2 ${
                      car.availability ? 'bg-green-400' : 'bg-red-400'
                    }`}
                  ></span>
                  {car.availability ? 'Available for Booking' : 'Currently Unavailable'}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">About This Vehicle</h3>
                <p className="text-slate-300 leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:ml-8 lg:flex-shrink-0">
              <div className="bg-slate-800/50 border border-slate-600 rounded-xl p-6 lg:w-64">
                <div className="text-center">
                  <p className="text-slate-400 text-sm font-medium mb-2">Daily Rental Rate</p>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-green-400">${car.price}</span>
                    <span className="text-slate-400 ml-2">/day</span>
                  </div>
                  
                  {/* Features List */}
                  <div className="text-left space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-300">
                      <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Free cancellation
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Full insurance included
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      24/7 roadside assistance
                    </div>
                    <div className="flex items-center text-sm text-slate-300">
                      <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      No hidden fees
                    </div>
                  </div>

                  {/* Quick Book Button - Only show if available */}
                  {car.availability && (
                    <button
                      onClick={() => {
                        const bookingSection = document.getElementById('booking-form');
                        bookingSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Car Specifications */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Vehicle Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-slate-800/50 rounded-lg p-4 mb-2">
                <svg className="w-8 h-8 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Engine</p>
              <p className="text-white font-medium">Premium</p>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 rounded-lg p-4 mb-2">
                <svg className="w-8 h-8 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a2 2 0 01-2-2v-2a2 2 0 012-2h2.343M11 8V6l4-4V0l-4 4H9M7 14l3-3 7 3" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Seats</p>
              <p className="text-white font-medium">5 People</p>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 rounded-lg p-4 mb-2">
                <svg className="w-8 h-8 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Luggage</p>
              <p className="text-white font-medium">3 Bags</p>
            </div>
            <div className="text-center">
              <div className="bg-slate-800/50 rounded-lg p-4 mb-2">
                <svg className="w-8 h-8 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">Transmission</p>
              <p className="text-white font-medium">Automatic</p>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div id="booking-form">
          <BookingForm carId={car.id} />
        </div>
      </div>
    </div>
  );
}
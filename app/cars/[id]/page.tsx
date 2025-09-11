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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-100 border-t-green-500 mb-6 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-green-100">
            <p className="text-gray-700 text-lg font-medium">Loading car details...</p>
            <div className="mt-3 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 p-8 transform hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-gray-900 text-xl font-bold mb-3">Oops!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
              <button 
                onClick={() => router.push('/')} 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 transform hover:scale-105 transition-transform duration-200">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-gray-900 text-xl font-bold mb-3">Car Not Found</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The car you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse All Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-600 px-4 py-2 rounded-xl transition-all duration-200 border border-gray-200 hover:border-green-200 font-medium"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cars
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Car Header */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-600/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between relative">
            <div className="mb-6 lg:mb-0 lg:flex-1">
              {/* Car Title */}
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {car.name} <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">- {car.model}</span>
              </h1>

              {/* Availability Badge */}
              <div className="flex items-center mb-6">
                <span 
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                    car.availability 
                      ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                      : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  <span 
                    className={`w-2 h-2 rounded-full mr-2 ${
                      car.availability ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                    }`}
                  ></span>
                  {car.availability ? 'Available for Booking' : 'Currently Unavailable'}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></div>
                  About This Vehicle
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>

            {/* Price Card */}
            <div className="lg:ml-8 lg:flex-shrink-0">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 lg:w-64 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <p className="text-green-600 text-sm font-semibold mb-2 uppercase tracking-wide">Daily Rental Rate</p>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-black text-gray-900">${car.price}</span>
                    <span className="text-gray-500 ml-2 font-medium">/day</span>
                  </div>
                  
                  {/* Features List */}
                  <div className="text-left space-y-3 mb-6">
                    {[
                      'Free cancellation',
                      'Full insurance included',
                      '24/7 roadside assistance',
                      'No hidden fees'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Quick Book Button - Only show if available */}
                  {car.availability && (
                    <button
                      onClick={() => {
                        const bookingSection = document.getElementById('booking-form');
                        bookingSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            Vehicle Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                label: 'Engine',
                value: 'Premium'
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a2 2 0 01-2-2v-2a2 2 0 012-2h2.343M11 8V6l4-4V0l-4 4H9M7 14l3-3 7 3" />
                  </svg>
                ),
                label: 'Seats',
                value: '5 People'
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ),
                label: 'Luggage',
                value: '3 Bags'
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                label: 'Transmission',
                value: 'Automatic'
              }
            ].map((spec, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-2xl p-6 mb-3 transition-all duration-300 group-hover:shadow-lg border border-green-100">
                  <div className="mx-auto group-hover:scale-110 transition-transform duration-300">
                    {spec.icon}
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium">{spec.label}</p>
                <p className="text-gray-900 font-bold">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div id="booking-form" className="scroll-mt-8">
          <BookingForm carId={car.id} />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
}
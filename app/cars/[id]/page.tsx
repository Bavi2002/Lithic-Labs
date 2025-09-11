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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">

            <p className="text-gray-700 text-lg font-medium">Loading car details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 transform hover:scale-105 transition-transform duration-200">
        
            <h2 className="text-gray-900 text-xl font-bold mb-3">Car Not Found</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              The car you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <button 
              onClick={() => router.push('/')} 
              className="bg-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Browse All Cars
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white ">


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl  border border-gray-200 p-8 mb-8 relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between relative">
            <div className="mb-6 lg:mb-0 lg:flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {car.name} <span className="text-green-600 ">- {car.model}</span>
              </h1>

              <div className="flex items-center mb-6">
                <span 
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    car.availability 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
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

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <div className="w-1 h-6 bg-green-600 rounded-full mr-3"></div>
                  About This Vehicle
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>

            <div className="lg:ml-8 lg:flex-shrink-0">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 lg:w-64 ">
                <div className="text-center">
                  <p className="text-green-600 text-sm font-semibold mb-2 uppercase tracking-wide">Daily Rental Rate</p>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-black text-gray-900">${car.price}</span>
                    <span className="text-gray-500 ml-2 font-medium">/day</span>
                  </div>
              

\                  {car.availability && (
                    <button
                      onClick={() => {
                        const bookingSection = document.getElementById('booking-form');
                        bookingSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-green-500 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>



        <div id="booking-form" className="scroll-mt-8">
          <BookingForm carId={car.id} />
        </div>
      </div>

  
    </div>
  );
}
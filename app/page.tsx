'use client';
import { useState, useEffect } from 'react';
import CarCard from './components/CarCard';
import { Car } from './types/car';
import { fetchCars } from './lib/api';
import { IoSearchOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const data = await fetchCars();
        console.log('Loaded cars:', data);
        setCars(data);
        setFilteredCars(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load cars');
      } finally {
        setLoading(false);
      }
    };
    loadCars();
  }, []);

  useEffect(() => {
    const filtered = cars.filter(car =>
      `${car.name} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCars(filtered);
  }, [searchTerm, cars]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          
            <p className="text-gray-700 text-lg font-medium">Loading cars...</p>
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

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
          
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              Premium Car <span className="text-green-600">Collection</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Discover our exclusive selection of luxury vehicles available for rental
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="relative bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <IoSearchOutline className='h-6 w-6 text-green-400' />
                </div>
                <input
                  type="text"
                  placeholder="Search by car name or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-16 py-5 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-green-500 transition-colors duration-200 group"
                  >
                    <div className="p-1 rounded-full group-hover:bg-green-50 transition-colors duration-200">
                      <RxCross2 className='h-5 w-5' />
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-5">
              All Cars
            </h2>
            
          
          
         

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
             
              <h3 className="text-gray-900 text-2xl font-bold mb-4">No cars found</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchTerm 
                  ? `No cars match "${searchTerm}". Try adjusting your search terms.`
                  : 'No cars are currently available.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                >
                  View all cars
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
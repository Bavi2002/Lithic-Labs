'use client';
import { useState, useEffect } from 'react';
import CarCard from './components/CarCard';
import { Car } from './types/car';
import { fetchCars } from './lib/api';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-100 border-t-green-500 mb-6 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-green-100">
            <p className="text-gray-700 text-lg font-medium">Loading premium cars...</p>
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mb-6 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
              Premium Car <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">Collection</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Discover our exclusive selection of luxury vehicles available for rental
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
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
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {searchTerm ? 'Search Results' : 'Available Cars'}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-gray-600 font-medium">
                {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
          </div>
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="group flex items-center space-x-2 bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 px-4 py-2 rounded-xl font-semibold transition-all duration-200 border border-green-200 hover:border-green-300"
            >
              <span>Clear search</span>
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
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

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
}
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
          <p className="text-white text-lg">Loading premium cars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
            <div className="text-red-400 text-5xl mb-4">⚠️</div>
            <h2 className="text-white text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Premium Car <span className="text-green-400">Collection</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Discover our exclusive selection of luxury vehicles available for rental
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by car name or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cars Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-semibold">
              {searchTerm ? 'Search Results' : 'Available Cars'}
            </h2>
            <p className="text-slate-400 mt-1">
              {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-16">
            <div className="bg-slate-900/50 rounded-xl p-8 max-w-md mx-auto">
              <div className="text-slate-400 text-6xl mb-4">🔍</div>
              <h3 className="text-white text-xl font-semibold mb-2">No cars found</h3>
              <p className="text-slate-400 mb-6">
                {searchTerm 
                  ? `No cars match "${searchTerm}". Try adjusting your search terms.`
                  : 'No cars are currently available.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg transition-colors duration-200"
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
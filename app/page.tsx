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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by name or model..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
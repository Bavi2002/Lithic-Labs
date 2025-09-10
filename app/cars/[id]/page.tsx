'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import BookingForm from '../../components/BookingForm';
import { Car } from '../../types/car';
import { fetchCar } from '../../lib/api';

export default function CarDetails() {
  const { id } = useParams();
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
          setError('Failed to load car');
        } finally {
          setLoading(false);
        }
      };
      loadCar();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!car) return <p>Car not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <h1 className="text-2xl font-bold">{car.name} - {car.model}</h1>
      <p>Price: ${car.price}/day</p>
      <BookingForm carId={car._id} />
    </div>
  );
}
'use client';
import Link from 'next/link';
import { Car } from '../types/car';

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="border p-4 rounded-lg hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold">{car.name} - {car.model}</h2>
      <p>Price: ${car.price}/day</p>
      <Link href={`/cars/${car._id}`} className="mt-2 inline-block bg-blue-500 text-white p-2 rounded">
        View Details
      </Link>
    </div>
  );
}
'use client';
import Link from 'next/link';
import { Car } from '../types/car';

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6  hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:shadow-green-100 group">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
          {car.name} - {car.model}
        </h2>
        
        <div className="flex items-center mb-3">
          <span 
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              car.availability 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <span 
              className={`w-2 h-2 rounded-full mr-2 ${
                car.availability ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></span>
            {car.availability ? 'Available' : 'Not Available'}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-600">${car.price}</span>
          <span className="text-gray-500 ml-1">/day</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
        {car.description}
      </p>

      <Link 
        href={`/cars/${car.id}`}
        className="inline-flex items-center justify-center w-full bg-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02]"
      >
        
        View Details
      </Link>
    </div>
  );
}
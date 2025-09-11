'use client';
import Link from 'next/link';
import { Car } from '../types/car';

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:shadow-green-100 group">
      {/* Header Section */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
          {car.name} - {car.model}
        </h2>
        
        {/* Availability Badge */}
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

      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-green-600">${car.price}</span>
          <span className="text-gray-500 ml-1">/day</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
        {car.description}
      </p>

      {/* Action Button */}
      <Link 
        href={`/cars/${car.id}`}
        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02]"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
          />
        </svg>
        View Details
      </Link>
    </div>
  );
}
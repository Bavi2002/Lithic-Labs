'use client';
import { useState } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { addCar } from '../lib/api';
import { useRouter } from 'next/navigation';

export default function AddCar() {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const carData = { name, model, price: parseFloat(price), description };
      await addCar(carData);
      alert('Car added successfully!');
      router.push('/');
    } catch (err) {
      console.log(err);
      setError('Failed to add car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white ">
        <div className="bg-white border-b border-green-100 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                Add <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">New Car</span>
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Add a new vehicle to your premium collection
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-300 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Car Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Tesla Model S"
                  className="w-full p-4 placeholder-gray-400 border border-gray-200 rounded-2xl text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., 2023 Performance"
                  className="w-full p-4 placeholder-gray-400 border border-gray-200 rounded-2xl text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the car features, condition, etc."
                  rows={4}
                  className="w-full p-4 placeholder-gray-400 border border-gray-200 rounded-2xl text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Price per day ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 99"
                  className="w-full p-4 placeholder-gray-400 border border-gray-200 rounded-2xl text-black"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-4 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                    Adding Car...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    
                    Add Car
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        
      </div>
    </ProtectedRoute>
  );
}
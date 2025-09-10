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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const carData = { name, model, price: parseFloat(price), description };
      await addCar(carData);
      alert('Car added successfully!');
      router.push('/');
    } catch (err) {
        console.log(err);
      setError('Failed to add car');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Add New Car</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Car Name"
            className="w-full p-2 border"
            required
          />
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="w-full p-2 border"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border"
            required
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per day"
            className="w-full p-2 border"
            required
          />
          <button type="submit" className="w-full p-2 bg-green-500 text-white">
            Add Car
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </ProtectedRoute>
  );
}
import { Car } from '../types/car';
import { Booking } from '../types/booking';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchCars = async (): Promise<Car[]> => {
  const response = await fetch(`${API_URL}/api/cars`);
  if (!response.ok) throw new Error('Failed to fetch cars');
  const { data } = await response.json();
  return data.map((car: Car) => ({ ...car, id: car.id }));
};

export const fetchCar = async (id: string): Promise<Car> => {
  const response = await fetch(`http://localhost:5000/api/cars/${id}`);
  if (!response.ok) throw new Error('Failed to fetch car');
  const { data } = await response.json();
  return { ...data, id: data.id };
};

export const fetchBookings = async (userId: string): Promise<Booking[]> => {
  const response = await fetch(`http://localhost:5000/api/bookings?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch bookings');
  const { data } = await response.json();
  return data.map((booking: Booking) => ({ ...booking, id: booking.id }));
};

export const createBooking = async (bookingData: {
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
}): Promise<Booking> => {
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: bookingData.userId,
      carId: bookingData.carId,
      startDate: bookingData.startDate.toISOString().split('T')[0],
      endDate: bookingData.endDate.toISOString().split('T')[0],
    }),
  });
  if (!response.ok) throw new Error('Failed to create booking');
  const { data } = await response.json();
  return { ...data, id: data.id };
};

export const addCar = async (carData: { name: string; model: string; price: number; description: string }): Promise<Car> => {
  const response = await fetch('http://localhost:5000/api/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData),
  });
  if (!response.ok) throw new Error('Failed to add car');
  const { data } = await response.json();
  return { ...data, id: data.id };
};

export const updateCarAvailability = async (id: string, availability: boolean): Promise<Car> => {
  const response = await fetch(`http://localhost:5000/api/cars/${id}/availability`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ availability }),
  });
  if (!response.ok) throw new Error('Failed to update car availability');
  const { data } = await response.json();
  return { ...data, id: data.id };
};
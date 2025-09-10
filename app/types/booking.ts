export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: { _seconds: number; _nanoseconds: number };
  endDate: { _seconds: number; _nanoseconds: number };
}
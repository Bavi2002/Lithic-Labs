import { Schema, model } from 'mongoose';

const bookingSchema = new Schema({
  userId: { type: String, required: true },
  carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

export default model('Booking', bookingSchema);
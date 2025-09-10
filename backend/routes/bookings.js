import { Router } from 'express';
import Booking from '../models/booking.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.query.userId });
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, carId, startDate, endDate } = req.body;
    const booking = new Booking({ userId, carId, startDate, endDate });
    await booking.save();
    res.status(201).json({ data: booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

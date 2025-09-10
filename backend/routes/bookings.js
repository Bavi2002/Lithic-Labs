import { Router } from 'express';
const router = Router();
import { db } from '../config/firebase.js';

router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'User ID is required' });
  const snapshot = await db.collection('bookings').where('userId', '==', userId).get();
  const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json({ data: bookings });
});

router.post('/', async (req, res) => {
  const { userId, carId, startDate, endDate } = req.body;
  const newBooking = {
    userId,
    carId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  };
  const docRef = await db.collection('bookings').add(newBooking);
  const doc = await docRef.get();
  res.status(201).json({ data: { id: doc.id, ...doc.data() } });
});

export default router;
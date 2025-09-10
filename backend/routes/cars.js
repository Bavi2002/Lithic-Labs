import { Router } from 'express';
const router = Router();
import { db } from '../config/firebase.js';

router.get('/', async (req, res) => {
  const snapshot = await db.collection('cars').get();
  const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json({ data: cars });
});

router.get('/:id', async (req, res) => {
  const doc = await db.collection('cars').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'Car not found' });
  res.json({ data: { id: doc.id, ...doc.data() } });
});

router.post('/', async (req, res) => {
  const { name, model, price, description } = req.body;
  const newCar = { name, model, price, availability: true, description };
  const docRef = await db.collection('cars').add(newCar);
  const doc = await docRef.get();
  res.status(201).json({ data: { id: doc.id, ...doc.data() } });
});

//update availability
router.put('/:id/availability', async (req, res) => {
  const { availability } = req.body;
  const carRef = db.collection('cars').doc(req.params.id);
  const doc = await carRef.get();
  if (!doc.exists) return res.status(404).json({ error: 'Car not found' });
  await carRef.update({ availability });
  const updatedDoc = await carRef.get();
  res.json({ data: { id: updatedDoc.id, ...updatedDoc.data() } });
});

export default router;
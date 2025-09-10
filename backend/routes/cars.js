import { Router } from 'express';
import Car from '../models/car.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ data: cars });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json({ data: car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, model, price } = req.body;
    const car = new Car({ name, model, price, availability: true });
    await car.save();
    res.status(201).json({ data: car });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

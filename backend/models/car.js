import { Schema, model } from 'mongoose';

const carSchema = new Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
});

export default model('Car', carSchema);
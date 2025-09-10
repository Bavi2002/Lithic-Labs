import express, { json } from 'express';
import connectDB from './config/db.js';
const app = express();

app.use(json());

connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
import express, { json } from "express";
import connectDB from "./config/db.js";
import Car from "./models/car.js";
import carRoutes from "./routes/cars.js";
import bookingRoutes from "./routes/bookings.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

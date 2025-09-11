import express, { json } from "express";
import carRoutes from "./routes/cars.js";
import bookingRoutes from "./routes/bookings.js";
import cors from "cors";

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://main.d2og3p4plv5953.amplifyapp.com" 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

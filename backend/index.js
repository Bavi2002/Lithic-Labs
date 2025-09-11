import express, { json } from "express";
import carRoutes from "./routes/cars.js";
import bookingRoutes from "./routes/bookings.js";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "https://main.d2og3p4plv5953.amplifyapp.com",
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

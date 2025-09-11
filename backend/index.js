import express from "express";
import carRoutes from "./routes/cars.js";
import bookingRoutes from "./routes/bookings.js";
import cors from "cors";
import serverless from "serverless-http";

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

// app.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });

// Export handler for Lambda
export const handler = serverless(app);

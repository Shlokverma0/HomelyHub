import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { bookingRouter } from "./routes/bookingRouter.js";
import { propertyRouter } from "./routes/propertyRouter.js";
import { tripRouter } from "./routes/tripRouter.js";
import { router as userRouter } from "./routes/userRoutes.js";
import connectDB from "./utils/db.js";

const app = express();
const port = Number(process.env.PORT) || 8080;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("This origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true, limit: "12mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.status(200).json({ name: "HomelyHub API", status: "running" });
});
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use("/api/v1/rent/user", userRouter);
app.use("/api/v1/rent/listing", propertyRouter);
app.use("/api/v1/rent/user/booking", bookingRouter);
app.use("/api/v1/rent/trip", tripRouter);

app.use((_req, res) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  const status = error.status || (error.type === "entity.too.large" ? 413 : 500);
  res.status(status).json({
    status: "fail",
    message: status === 500 ? "Internal server error" : error.message,
  });
});

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`HomelyHub API is running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("HomelyHub API could not start:", error.message);
  process.exitCode = 1;
});

export { app };

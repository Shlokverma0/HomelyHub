import express from "express";
import { createTripPlan } from "../controllers/aiController.js";

const tripRouter = express.Router();
tripRouter.post("/", createTripPlan);

export { tripRouter };

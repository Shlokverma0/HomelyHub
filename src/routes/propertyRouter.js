import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createProperty,
  getProperties,
  getProperty,
} from "../controllers/propertyController.js";

const propertyRouter = express.Router();

propertyRouter.route("/").get(getProperties).post(protect, createProperty);
propertyRouter.route("/:id").get(getProperty);

export { propertyRouter };

import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createBooking,
  getBookingDetails,
  getUserBookings,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.use(protect);
bookingRouter.route("/").get(getUserBookings).post(createBooking);
bookingRouter.route("/:bookingId").get(getBookingDetails);

export { bookingRouter };

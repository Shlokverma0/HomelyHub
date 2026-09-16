import express from "express"
const bookingRouter = express.Router()

import{
  getBookingDetails,getUserBookings,verifyPayment,createOrder
} from "../controllers/bookingController.js"

import {protect} from "../controllers/authControllers.js"

bookingRouter.get("/",protect,getUserBookings);
bookingRouter.get("/:bookingId",protect,getBookingDetails);
bookingRouter.post("/create-order",protect,createOrder);
bookingRouter.post("/verify-payment",protect,verifyPayment);

export {bookingRouter};
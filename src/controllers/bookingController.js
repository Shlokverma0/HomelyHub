import mongoose from "mongoose";
import { Booking } from "../Models/bookingModel.js";
import { Property } from "../Models/propertyModel.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
};

const createBooking = async (req, res) => {
  let booking;
  try {
    const { propertyId, fromDate: fromDateInput, toDate: toDateInput, guests } =
      req.body;
    const fromDate = parseDate(fromDateInput);
    const toDate = parseDate(toDateInput);
    const guestCount = Number(guests);

    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({ status: "fail", message: "Invalid property" });
    }
    if (!fromDate || !toDate || toDate <= fromDate) {
      return res.status(400).json({
        status: "fail",
        message: "Choose valid check-in and check-out dates",
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (fromDate < today) {
      return res.status(400).json({
        status: "fail",
        message: "Check-in date cannot be in the past",
      });
    }
    if (!Number.isInteger(guestCount) || guestCount < 1) {
      return res.status(400).json({
        status: "fail",
        message: "Guest count must be at least one",
      });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ status: "fail", message: "Property not found" });
    }
    if (guestCount > property.maximumGuest) {
      return res.status(400).json({
        status: "fail",
        message: `This property allows up to ${property.maximumGuest} guests`,
      });
    }

    const numberOfnights = Math.round((toDate - fromDate) / DAY_MS);
    const price = property.price * numberOfnights;
    booking = await Booking.create({
      property: property._id,
      user: req.user._id,
      price,
      fromDate,
      toDate,
      guests: guestCount,
      numberOfnights,
      paid: false,
    });

    // The conditional update makes the availability check atomic, so two
    // concurrent requests cannot reserve overlapping dates.
    const reservedProperty = await Property.findOneAndUpdate(
      {
        _id: property._id,
        currentBookings: {
          $not: {
            $elemMatch: {
              fromDate: { $lt: toDate },
              toDate: { $gt: fromDate },
            },
          },
        },
      },
      {
        $push: {
          currentBookings: {
            bookingId: booking._id,
            fromDate,
            toDate,
            userId: req.user._id,
          },
        },
      },
      { new: true },
    );

    if (!reservedProperty) {
      await Booking.findByIdAndDelete(booking._id);
      return res.status(409).json({
        status: "fail",
        message: "Those dates are no longer available. Please choose other dates.",
      });
    }

    res.status(201).json({
      status: "success",
      message: "Reservation confirmed. No payment was processed.",
      data: { booking },
    });
  } catch (error) {
    if (booking?._id) await Booking.findByIdAndDelete(booking._id).catch(() => {});
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: "property",
        select: "propertyName images address checkInTime checkOutTime",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: bookings.length,
      data: { bookings },
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.bookingId)) {
      return res.status(404).json({ status: "fail", message: "Booking not found" });
    }

    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      user: req.user._id,
    }).populate({
      path: "property",
      select: "propertyName images address checkInTime checkOutTime",
    });

    if (!booking) {
      return res.status(404).json({ status: "fail", message: "Booking not found" });
    }

    res.status(200).json({ status: "success", data: { booking } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export { createBooking, getBookingDetails, getUserBookings };

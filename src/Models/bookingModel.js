import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Booking must belong to a property"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
    },
    price: {
      type: Number,
      required: true,
      min: [1, "Booking price must be greater than zero"],
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    numberOfnights: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    paid: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export { Booking };

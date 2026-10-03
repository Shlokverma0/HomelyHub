import mongoose from "mongoose";
import slugify from "slugify";

const imageSchema = new mongoose.Schema(
  {
    public_id: { type: String, default: "" },
    url: { type: String, required: [true, "Each photo needs a URL"] },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    area: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const currentBookingSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

const propertySchema = new mongoose.Schema(
  {
    propertyName: {
      type: String,
      required: [true, "Please enter your property name"],
      trim: true,
      maxlength: [100, "Property name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add information about your property"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    extraInfo: {
      type: String,
      trim: true,
      default: "Please coordinate check-in time with the host.",
      maxlength: [1000, "House rules cannot exceed 1000 characters"],
    },
    propertyType: {
      type: String,
      enum: ["House", "Flat", "Guest House", "Hotel"],
      default: "House",
    },
    roomType: {
      type: String,
      enum: ["Anytype", "Room", "Entire Home"],
      default: "Entire Home",
    },
    maximumGuest: {
      type: Number,
      required: [true, "Please tell the maximum number of guests"],
      min: [1, "A property must allow at least one guest"],
      max: [50, "Maximum guest count cannot exceed 50"],
    },
    amenities: [
      {
        name: { type: String, required: true, trim: true },
        icon: { type: String, default: "check_circle" },
      },
    ],
    images: {
      type: [imageSchema],
      required: [true, "Add at least one property photo"],
      validate: {
        validator: (images) => images.length >= 1 && images.length <= 12,
        message: "Add between 1 and 12 property photos",
      },
    },
    price: {
      type: Number,
      required: [true, "Please enter the price per night"],
      min: [1, "Price per night must be greater than zero"],
      max: [10000000, "Price per night is too high"],
    },
    address: { type: addressSchema, required: true },
    currentBookings: { type: [currentBookingSchema], default: [] },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    slug: { type: String, index: true },
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },
  },
  { timestamps: true },
);

propertySchema.pre("save", function () {
  if (this.isModified("propertyName")) {
    this.slug = slugify(this.propertyName, { lower: true, strict: true });
  }
});

const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);

export { Property };

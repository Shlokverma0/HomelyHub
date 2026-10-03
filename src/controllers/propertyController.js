import mongoose from "mongoose";
import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";

const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(Property.find(), req.query)
      .filter()
      .search();
    const total = await features.query.clone().countDocuments();
    const properties = await features.paginate().query.sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: properties.length,
      all_properties: total,
      data: properties,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

const getProperty = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ status: "fail", message: "Property not found" });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ status: "fail", message: "Property not found" });
    }

    res.status(200).json({ status: "success", data: property });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ userID: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      status: "success",
      results: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      extraInfo,
      propertyType,
      roomType,
      maximumGuest,
      amenities,
      images,
      price,
      address,
      checkInTime,
      checkOutTime,
    } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Add at least one property photo before publishing",
      });
    }

    if (images.length > 12) {
      return res.status(400).json({
        status: "fail",
        message: "You can add up to 12 property photos",
      });
    }

    const validImage = (image) => {
      if (typeof image?.url !== "string") return false;
      if (/^https?:\/\/\S+$/i.test(image.url)) return image.url.length <= 2048;
      return /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(image.url);
    };
    if (!images.every(validImage)) {
      return res.status(400).json({
        status: "fail",
        message: "Use JPG, PNG, or WebP photos, or provide an http/https image URL.",
      });
    }
    const inlineImageBytes = images.reduce((total, image) => {
      if (!image.url.startsWith("data:image/")) return total;
      return total + Math.floor(((image.url.split(",")[1] || "").length * 3) / 4);
    }, 0);
    if (inlineImageBytes > 10 * 1024 * 1024) {
      return res.status(413).json({
        status: "fail",
        message: "Property photos are too large. Reduce the file sizes and try again.",
      });
    }

    const property = await Property.create({
      propertyName,
      description,
      extraInfo,
      propertyType,
      roomType,
      maximumGuest: Number(maximumGuest),
      amenities: Array.isArray(amenities) ? amenities : [],
      images,
      price: Number(price),
      address,
      checkInTime,
      checkOutTime,
      userID: req.user._id,
    });

    res.status(201).json({ status: "success", data: { property } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

export { createProperty, getMyProperties, getProperties, getProperty };

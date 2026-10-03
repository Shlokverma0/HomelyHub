import { Property } from "../Models/propertyModel.js";
import { completeJson } from "../services/groqService.js";

const respondWithAIError = (res, error, fallback) => {
  const status = error.statusCode || 502;
  res.status(status).json({
    status: "fail",
    message: status === 503 ? error.message : fallback,
  });
};

const writeDescription = async (req, res) => {
  try {
    const {
      propertyName,
      extraInfo = "",
      propertyType = "",
      roomType = "",
      maximumGuest,
      amenities = [],
      address = {},
    } = req.body;

    if (typeof propertyName !== "string" || propertyName.trim().length < 3) {
      return res.status(400).json({
        status: "fail",
        message: "Enter a property name with at least 3 characters first.",
      });
    }

    const details = {
      name: propertyName.trim().slice(0, 100),
      type: String(propertyType).slice(0, 40),
      roomType: String(roomType).slice(0, 40),
      guests: Number(maximumGuest) || 1,
      area: String(address.area || "").slice(0, 100),
      city: String(address.city || "").slice(0, 100),
      amenities: Array.isArray(amenities)
        ? amenities.slice(0, 12).map((item) => String(item.name || item).slice(0, 40))
        : [],
      houseRules: String(extraInfo).slice(0, 500),
    };

    const result = await completeJson({
      system:
        "Write clear, accurate short descriptions for property listings. Use only the supplied facts. Do not invent views, locations, facilities, or services. Return JSON with one string field named description.",
      prompt: `Write a welcoming 80-140 word property description from these details. Return JSON only.\n${JSON.stringify(details)}`,
      maxTokens: 400,
    });
    const description = String(result.description || "").trim();
    if (description.length < 20 || description.length > 1500) {
      throw new Error("The AI returned an invalid property description.");
    }

    res.status(200).json({ status: "success", data: { description } });
  } catch (error) {
    respondWithAIError(res, error, "Could not generate a property description.");
  }
};

const createTripPlan = async (req, res) => {
  try {
    const { destination, budget, days, people, interests = [] } = req.body;
    const tripDays = Number(days);
    const travelers = Number(people);
    const totalBudget = Number(budget);

    if (
      typeof destination !== "string" ||
      destination.trim().length < 2 ||
      destination.length > 100 ||
      !Number.isFinite(totalBudget) ||
      totalBudget <= 0 ||
      !Number.isInteger(tripDays) ||
      tripDays < 1 ||
      tripDays > 14 ||
      !Number.isInteger(travelers) ||
      travelers < 1 ||
      travelers > 20 ||
      !Array.isArray(interests) ||
      interests.length > 8
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Enter a destination, positive budget, 1-14 days, and 1-20 travelers.",
      });
    }

    const cleanInterests = interests
      .filter((item) => typeof item === "string")
      .map((item) => item.slice(0, 40));
    const promptData = {
      destination: destination.trim(),
      days: tripDays,
      people: travelers,
      budgetINR: totalBudget,
      interests: cleanInterests,
    };

    const plan = await completeJson({
      system:
        "You are a practical travel itinerary planner. Return JSON only, with fields summary (string), days (array of objects with integer day, title, and activities string array), and tips (string array). Keep suggestions general and do not invent opening hours or claim real-time availability.",
      prompt: `Create exactly ${tripDays} day entries for this trip. Keep activities concise and fit a modest budget.\n${JSON.stringify(promptData)}`,
      maxTokens: Math.min(3500, 450 + tripDays * 180),
    });

    if (
      typeof plan.summary !== "string" ||
      !Array.isArray(plan.days) ||
      plan.days.length !== tripDays ||
      plan.days.some(
        (day, index) =>
          day.day !== index + 1 ||
          typeof day.title !== "string" ||
          !Array.isArray(day.activities),
      )
    ) {
      throw new Error("The AI returned an invalid itinerary.");
    }

    const perNight = totalBudget / tripDays;
    const cityPattern = new RegExp(
      destination.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
    const properties = await Property.find({
      price: { $lte: perNight },
      maximumGuest: { $gte: travelers },
      $or: [
        { "address.city": cityPattern },
        { "address.state": cityPattern },
        { "address.area": cityPattern },
      ],
    })
      .select("propertyName price maximumGuest address images")
      .limit(6);

    res.status(200).json({
      status: "success",
      data: { plan, properties, perNight },
    });
  } catch (error) {
    respondWithAIError(res, error, "Could not create a trip plan. Please try again.");
  }
};

export { createTripPlan, writeDescription };

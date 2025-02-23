import mongoose from "mongoose";
import Pricing from "./src/models/Pricing.js";
import dotenv from "dotenv";
dotenv.config();

const seedPricingData = async () => {
  try {
    // Connect to MongoDB
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));

    // Create or update pricing data
    const pricingData = {
      basic: {
        price: 22,
        description: "Perfect for short assignments",
        pageRange: "1-10",
        features: [
          "₹20 writing charge per page",
          "₹2 printing charge per page",
          "Professional writers",
        ],
      },
      standard: {
        price: 17,
        description: "Ideal for longer assignments",
        pageRange: "10+",
        features: [
          "₹15 writing charge per page",
          "₹2 printing charge per page",
          "Free revisions",
          "Professional writers",
          "Priority support",
        ],
      },
    };

    // Use findOneAndUpdate to create or update the pricing data
    await Pricing.findOneAndUpdate({}, pricingData, { upsert: true, new: true });
    console.log("Pricing data seeded or updated successfully!");
  } catch (error) {
    console.error("Error seeding pricing data:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedPricingData();


// node seedPricing.js

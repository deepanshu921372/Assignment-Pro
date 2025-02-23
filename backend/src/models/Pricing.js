import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema({
  basic: {
    price: { type: Number, required: true },
    description: { type: String, required: true },
    pageRange: { type: String, required: true },
    features: { type: [String], required: true }
  },
  standard: {
    price: { type: Number, required: true },
    description: { type: String, required: true },
    pageRange: { type: String, required: true },
    features: { type: [String], required: true }
  }
}, { timestamps: true });

const Pricing = mongoose.model('Pricing', pricingSchema);
export default Pricing; 
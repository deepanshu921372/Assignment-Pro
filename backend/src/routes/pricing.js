import express from 'express';
import Pricing from '../models/Pricing.js'; // Adjust the path as necessary
const router = express.Router();

// GET route to fetch pricing
router.get('/', async (req, res) => {
  try {
    const pricing = await Pricing.findOne(); // Assuming only one pricing document
    if (!pricing) {
      return res.status(404).json({ message: 'Pricing data not found' });
    }
    res.status(200).json(pricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ message: 'Failed to fetch pricing' });
  }
});

// PUT route to update pricing
router.put('/', async (req, res) => {
  try {
    const { basic, standard } = req.body;
    const updatedPricing = await Pricing.findOneAndUpdate({}, { basic, standard }, { new: true });
    res.status(200).json(updatedPricing);
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({ message: 'Failed to update pricing' });
  }
});

export default router; 
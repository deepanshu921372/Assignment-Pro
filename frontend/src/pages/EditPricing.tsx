import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
const EditPricing = () => {
  const { isAdmin } = useAuth(); // Get admin status from context
  const navigate = useNavigate();
  const [basicPrice, setBasicPrice] = useState<number>(0);
  const [standardPrice, setStandardPrice] = useState<number>(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/pricing`);
        setBasicPrice(response.data.basic.price);
        setStandardPrice(response.data.standard.price);
      } catch (err) {
        // setError('Failed to fetch pricing');
        showToast('Failed to fetch pricing', 'error');
      }
    };

    fetchPricing();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await axios.put(`${API_BASE_URL}api/pricing`, {
        basic: { price: basicPrice },
        standard: { price: standardPrice }
      });
      showToast('Pricing updated successfully', 'success');
    } catch (err: any) {
      // setError(err.response?.data?.message || 'Failed to update pricing');
      showToast('Failed to update pricing', 'error');
    } finally {
      setLoading(false);
      navigate('/pricing');
    }
  };

  if (!isAdmin) {
    return null; // Do not render if not an admin
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Edit Pricing
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Basic Pricing (₹)"
            type="number"
            value={basicPrice}
            onChange={(e) => setBasicPrice(Number(e.target.value))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Standard Pricing (₹)"
            type="number"
            value={standardPrice}
            onChange={(e) => setStandardPrice(Number(e.target.value))}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Updating...' : 'Update Pricing'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EditPricing; 
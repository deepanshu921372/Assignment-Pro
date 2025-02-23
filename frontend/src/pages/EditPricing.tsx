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
  const [basicDescription, setBasicDescription] = useState<string>('');
  const [basicPageRange, setBasicPageRange] = useState<string>('');
  const [basicFeatures, setBasicFeatures] = useState<string[]>([]);
  
  const [standardPrice, setStandardPrice] = useState<number>(0);
  const [standardDescription, setStandardDescription] = useState<string>('');
  const [standardPageRange, setStandardPageRange] = useState<string>('');
  const [standardFeatures, setStandardFeatures] = useState<string[]>([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/pricing`);
        const { basic, standard } = response.data;

        setBasicPrice(basic.price);
        setBasicDescription(basic.description);
        setBasicPageRange(basic.pageRange);
        setBasicFeatures(basic.features);
        
        setStandardPrice(standard.price);
        setStandardDescription(standard.description);
        setStandardPageRange(standard.pageRange);
        setStandardFeatures(standard.features);
      } catch (err) {
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
        basic: {
          price: basicPrice,
          description: basicDescription,
          pageRange: basicPageRange,
          features: basicFeatures,
        },
        standard: {
          price: standardPrice,
          description: standardDescription,
          pageRange: standardPageRange,
          features: standardFeatures,
        },
      });
      showToast('Pricing updated successfully', 'success');
    } catch (err: any) {
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
          <Typography variant="h6">Basic Pricing</Typography>
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
            label="Basic Description"
            value={basicDescription}
            onChange={(e) => setBasicDescription(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Basic Page Range"
            value={basicPageRange}
            onChange={(e) => setBasicPageRange(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Basic Features (comma separated)"
            value={basicFeatures.join(', ')}
            onChange={(e) => setBasicFeatures(e.target.value.split(',').map(feature => feature.trim()))}
            margin="normal"
            required
          />

          <Typography variant="h6">Standard Pricing</Typography>
          <TextField
            fullWidth
            label="Standard Pricing (₹)"
            type="number"
            value={standardPrice}
            onChange={(e) => setStandardPrice(Number(e.target.value))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Standard Description"
            value={standardDescription}
            onChange={(e) => setStandardDescription(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Standard Page Range"
            value={standardPageRange}
            onChange={(e) => setStandardPageRange(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Standard Features (comma separated)"
            value={standardFeatures.join(', ')}
            onChange={(e) => setStandardFeatures(e.target.value.split(',').map(feature => feature.trim()))}
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
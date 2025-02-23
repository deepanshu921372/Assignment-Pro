import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../config';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
const PricingPlan = ({ 
  title, 
  price, 
  description, 
  features, 
  pageRange 
}: { 
  title: string;
  price: number;
  description: string;
  features: string[];
  pageRange: string;
}) => {
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/pricing`);
        setPricing(response.data);
        console.log(response.data);
      } catch (error) {
        showToast('Failed to fetch pricing', 'error');
        setError('Failed to fetch pricing');
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  return (
    <Paper sx={{ 
      p: 4, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6
      }
    }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {description}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
        <Typography variant="h3" component="span">
          ₹{price}
        </Typography>
        <Typography variant="h6" component="span" color="text.secondary">
          /page
        </Typography>
      </Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {pageRange}
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        {features.map((feature, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
            <CheckCircle color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{feature}</Typography>
          </Box>
        ))}
      </Box>
      {!isAdmin && (
        <Button 
        variant="contained" 
        fullWidth 
        sx={{ mt: 3 }}
        onClick={() => navigate('/submit-assignment')}
      >
        Get Started
      </Button>
      )}
      {isAdmin && (
        <Button 
        variant="contained" 
        fullWidth 
        sx={{ mt: 3 }}
        onClick={() => navigate('/edit-pricing')}
      >
        Edit Pricing
      </Button>
      )}
    </Paper>
  );
};

const Pricing = () => {
  const [pricing, setPricing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}api/pricing`);
        setPricing(response.data);
      } catch (error) {
        showToast('Failed to fetch pricing', 'error');
        setError('Failed to fetch pricing');
      } finally {
        setLoading(false);
      }
    };

    fetchPricing();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!pricing || !pricing.basic || !pricing.standard) {
    return <Typography variant="h6" color="error">Pricing data is not available.</Typography>;
  }

  return (
    <Container sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Simple, Transparent Pricing
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Choose the perfect plan for your assignment needs. All plans include delivery charges based on your location.
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <PricingPlan 
            title="Basic" 
            price={pricing.basic.price} 
            description={pricing.basic.description} 
            pageRange={pricing.basic.pageRange} 
            features={pricing.basic.features} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PricingPlan 
            title="Standard" 
            price={pricing.standard.price} 
            description={pricing.standard.description} 
            pageRange={pricing.standard.pageRange} 
            features={pricing.standard.features} 
          />
        </Grid>
      </Grid>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center" 
        sx={{ mt: 4 }}
      >
        * Delivery charges will be calculated based on your location
      </Typography>
    </Container>
  );
};

export default Pricing;
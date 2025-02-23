import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Expert Assignment Writing Service
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Get your assignments done by professionals. Quality work, on-time delivery, and affordable prices guaranteed.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            to="/submit-assignment"
            variant="contained"
            size="large"
          >
            Submit Assignment
          </Button>
          <Button
            component={Link}
            to="/pricing"
            variant="outlined"
            size="large"
          >
            View Pricing
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Professional Assignment Writing
            </Typography>
            <Typography color="text.secondary">
              Expert writers with years of experience in academic writing
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Turnaround Time
            </Typography>
            <Typography color="text.secondary">
              Get your assignments delivered within the specified deadline
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Affordable Pricing
            </Typography>
            <Typography color="text.secondary">
              Competitive prices with high-quality work guaranteed
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
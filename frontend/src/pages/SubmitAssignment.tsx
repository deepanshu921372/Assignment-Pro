import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config';
import { useToast } from '../contexts/ToastContext';

const SubmitAssignment = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [files, setFiles] = useState({
    assignmentFile: null as File | null,
    answerKeyFile: null as File | null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.assignmentFile || !files.answerKeyFile) {
      setError('Please upload both assignment and answer key files');
      showToast('Please upload both assignment and answer key files', 'error');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('assignmentFile', files.assignmentFile);
      formDataToSend.append('answerKeyFile', files.answerKeyFile);

      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}api/assignments`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showToast('Assignment submitted successfully!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
      showToast(err.response?.data?.message || 'Failed to submit assignment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Submit Assignment
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Assignment Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Assignment File (PDF or Word)
            </Typography>
            <input
              accept=".pdf,.doc,.docx"
              type="file"
              name="assignmentFile"
              onChange={handleFileChange}
              required
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Answer Key File (PDF or Word)
            </Typography>
            <input
              accept=".pdf,.doc,.docx"
              type="file"
              name="answerKeyFile"
              onChange={handleFileChange}
              required
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Assignment'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SubmitAssignment;
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Select,
  MenuItem,
  Alert,
  FormControl,
  SelectChangeEvent,
  Button,
  CircularProgress,
  Container,
  Grid
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import API_BASE_URL from '../config';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../hooks/useTheme';


interface Assignment {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  price: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

const statusColors = {
  pending: 'warning',
  'in-progress': 'info',
  completed: 'success'
} as const;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { mode } = useTheme();


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (!isAdmin) {
        navigate('/dashboard');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}api/assignments/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignments(response.data);
      } catch (err: any) {
        // setError('Failed to fetch assignments');
        showToast('Failed to fetch assignments', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [isAuthenticated, isAdmin, navigate]);

  const handleStatusChange = async (assignmentId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_BASE_URL}api/assignments/${assignmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Assignment status updated successfully', 'success');
      setAssignments(assignments.map(assignment => 
        assignment._id === assignmentId 
          ? { ...assignment, status: newStatus as Assignment['status'] }
          : assignment
      ));
    } catch (err: any) {
      // setError('Failed to update assignment status');
      showToast('Failed to update assignment status', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
       <Container>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bolder", fontSize: "2rem", color: mode === 'dark' ? '#ffffff' : '#000000' }}
          >
            AssignmentPro - Expert Assignment Writing Service
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Get your assignments done by professionals. Quality work, on-time
            delivery, and affordable prices guaranteed.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Professional Assignment Writing
              </Typography>
              <Typography color="text.secondary">
                Expert writers with years of experience in academic writing
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Quick Turnaround Time
              </Typography>
              <Typography color="text.secondary">
                Get your assignments delivered within the specified deadline
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                textAlign: "center",
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 10,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 0, fontWeight: "bold", fontSize: { md: "2rem", xs: "1.2rem" } }}>
          All Assignments
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/edit-pricing")}
          sx={{ width: { xs: "auto", md: "auto" } }}
        >
          Edit Pricing
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>User Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Submitted On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No assignments submitted yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>
                    <Typography variant="subtitle2">{assignment.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {assignment.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{assignment.user.name}</Typography>
                    <Typography variant="body2">{assignment.user.email}</Typography>
                    <Typography variant="body2">{assignment.user.phone}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {assignment.user.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small">
                      <Select
                        value={assignment.status}
                        onChange={(e: SelectChangeEvent) => 
                          handleStatusChange(assignment._id, e.target.value)
                        }
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="pending">
                          <Chip 
                            label="Pending" 
                            color={statusColors.pending}
                            size="small"
                          />
                        </MenuItem>
                        <MenuItem value="in-progress">
                          <Chip 
                            label="In Progress" 
                            color={statusColors['in-progress']}
                            size="small"
                          />
                        </MenuItem>
                        <MenuItem value="completed">
                          <Chip 
                            label="Completed" 
                            color={statusColors.completed}
                            size="small"
                          />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>{assignment.price}</TableCell>
                  <TableCell>
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleStatusChange(assignment._id, 'completed')}>Complete</Button>
                    <Button onClick={() => handleStatusChange(assignment._id, 'in-progress')}>In Progress</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;
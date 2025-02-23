import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Button,
  Alert,
  Container,
  Grid,
  Link,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import API_BASE_URL from "../config";

interface Assignment {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  price: number;
  createdAt: string;
}

const statusColors = {
  pending: "warning",
  "in-progress": "info",
  completed: "success",
} as const;

const UserDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}api/assignments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(response.data);
      } catch (err: any) {
        setError("Failed to fetch assignments");
      }
    };

    fetchAssignments();
  }, [isAuthenticated, navigate]);

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting assignment with ID: ${id}`); // Log the ID
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}api/assignments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Reload assignments after deletion
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
      // Optionally, you can reload the page to reflect changes
      window.location.reload(); // Uncomment this line if you want to reload the entire page
    } catch (err: any) {
      console.error(err); // Log the error
      setError("Failed to delete assignment");
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 4 }}>
      <Container>
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bolder", fontSize: "2rem" }}
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
          My Assignments
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/submit-assignment")}
          sx={{ width: { xs: "auto", md: "auto" } }}
        >
          Submit Assignment
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price (₹)</TableCell>
              <TableCell>Submitted On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 3 }}>
                    No assignments submitted yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={assignment.status}
                      color={statusColors[assignment.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{assignment.price}</TableCell>
                  <TableCell>
                    {new Date(assignment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(assignment._id)}
                    >
                      Delete
                    </Button>
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

export default UserDashboard;

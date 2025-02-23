// frontend/src/components/Layout.tsx
import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "../hooks/useTheme";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const { toggleTheme, mode } = useTheme();

  // State for menu anchor
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handle menu open/close
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: mode === "dark" ? "#121212" : "#ffffff",
      }}
    >
      <AppBar
        position="static"
        sx={{
          borderRadius: "0px",
          bgcolor: mode === "dark" ? "#121212" : "#ffffff",
          color: mode === "dark" ? "#ffffff" : "#000000",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: mode === "dark" ? "#ffffff" : "#000000",
              fontWeight: "bolder",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            AssignmentPro
          </Typography>

          {/* Menu Icon for small screens */}
          <IconButton
            onClick={handleMenuClick}
            color="inherit"
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Theme Toggle Icon */}
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {/* Menu for small screens */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={Link} to="/pricing" onClick={handleMenuClose}>
              Pricing
            </MenuItem>
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <MenuItem
                    component={Link}
                    to="/submit-assignment"
                    onClick={handleMenuClose}
                  >
                    Submit Assignment
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    logout();
                    handleMenuClose();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleMenuClose}
                >
                  Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/signup"
                  onClick={handleMenuClose}
                >
                  Sign Up
                </MenuItem>
              </>
            )}
          </Menu>

          {/* Buttons for larger screens */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button color="inherit" component={Link} to="/pricing">
              Pricing
            </Button>
            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/submit-assignment"
                  >
                    Submit Assignment
                  </Button>
                )}
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
            <IconButton
              onClick={toggleTheme}
              color="inherit"
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: "auto",
          backgroundColor: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
        }}
      >
        <Typography
          variant="body2"
          color={mode === "dark" ? "#ffffff" : "#000000"}
          align="center"
        >
          © {new Date().getFullYear()} AssignmentPro. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;

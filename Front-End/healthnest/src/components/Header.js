import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  styled,
} from '@mui/material';
import { AccountCircle, ArrowDropDown, MedicalServices } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #75AADB 0%, #4A7FB8 100%)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#ffffff',
}));

const NavButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  textTransform: 'none',
  fontSize: '1rem',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    handleMenuClose();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    handleLogout();
  };

  const handleFeedback = () => {
    handleMenuClose();
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ padding: '0 24px' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 3 }}>
          <NavButton color="inherit" onClick={() => navigate('/')}>
            Home
          </NavButton>
          <NavButton color="inherit" onClick={() => navigate('/about')}>
            About Us
          </NavButton>
        </Box>

        <LogoText variant="h5" component="div" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <MedicalServices sx={{ fontSize: 28, color: '#ffffff' }} />
          HealthNest
        </LogoText>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  color: '#ffffff',
                }}
              >
                Welcome, {username}
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleMenuClick}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                <AccountCircle />
                <ArrowDropDown />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 180,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <MenuItem 
                  onClick={handleFeedback}
                  sx={{ 
                    fontFamily: "'Poppins', sans-serif",
                    '&:hover': {
                      backgroundColor: 'rgba(117, 170, 219, 0.1)',
                    }
                  }}
                >
                  Give Feedback
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    fontFamily: "'Poppins', sans-serif",
                    '&:hover': {
                      backgroundColor: 'rgba(117, 170, 219, 0.1)',
                    }
                  }}
                >
                  Logout
                </MenuItem>
                <MenuItem 
                  onClick={handleDeleteAccount}
                  sx={{ 
                    fontFamily: "'Poppins', sans-serif",
                    '&:hover': {
                      backgroundColor: 'rgba(117, 170, 219, 0.1)',
                    }
                  }}
                >
                  Delete Account
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <NavButton 
                color="inherit" 
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  }
                }}
              >
                Login
              </NavButton>
              <NavButton 
                color="inherit" 
                onClick={() => navigate('/create-account')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  }
                }}
              >
                Create Account
              </NavButton>
            </>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
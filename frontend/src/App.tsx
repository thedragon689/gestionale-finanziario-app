import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { AccountBalance, SwapHoriz, AccountBalanceWallet, People, Assessment, Settings as SettingsIcon, RssFeed, ShowChart, Security } from '@mui/icons-material';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Accounts from './pages/Accounts/Accounts';
import Transactions from './pages/Transactions/Transactions';
import Customers from './pages/Customers/Customers';
import CryptoWallets from './pages/CryptoWallets/CryptoWallets';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import RSS from './pages/RSS';
import Funds from './pages/Funds';
import Insurance from './pages/Insurance';
import Login from './pages/Auth/Login';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Simple Navigation Component
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { text: 'Dashboard', icon: <AccountBalance />, path: '/' },
    { text: 'Conti', icon: <AccountBalance />, path: '/accounts' },
    { text: 'Transazioni', icon: <SwapHoriz />, path: '/transactions' },
    { text: 'Criptovalute', icon: <AccountBalanceWallet />, path: '/crypto' },
    { text: 'Clienti', icon: <People />, path: '/customers' },
    { text: 'Report', icon: <Assessment />, path: '/reports' },
    { text: 'RSS Borsa', icon: <RssFeed />, path: '/rss' },
    { text: 'Fondi', icon: <ShowChart />, path: '/funds' },
    { text: 'Assicurazioni', icon: <Security />, path: '/insurance' },
    { text: 'Impostazioni', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant={location.pathname === item.path ? "contained" : "outlined"}
            startIcon={item.icon}
            onClick={() => navigate(item.path)}
            sx={{ textTransform: 'none' }}
          >
            {item.text}
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
          {isAuthenticated() ? (
            <>
              <Navigation />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/crypto" element={<CryptoWallets />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/rss" element={<RSS />} />
                <Route path="/funds" element={<Funds />} />
                <Route path="/insurance" element={<Insurance />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Login />} />
            </Routes>
          )}
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import logo
import logo from '../../assets/logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pulisci eventuali token invalidi all'apertura della pagina
  useEffect(() => {
    // Rimuovi token e dati utente esistenti per forzare il login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Mock authentication - replace with actual API call
      if (formData.email === 'admin@bank.com' && formData.password === 'password') {
        // Salva i dati di autenticazione
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          name: 'Admin User',
          email: formData.email,
          role: 'admin',
        }));

        // Controlla se c'è un reindirizzamento salvato
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath && redirectPath !== '/login' && redirectPath !== '/reports') {
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          // Reindirizza alla dashboard di default
          navigate('/');
        }
      } else {
        setError('Credenziali non valide');
      }
    } catch (err) {
      setError('Errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            p: 4,
            textAlign: 'center',
          }}
        >
          {/* Logo dell'applicazione */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              src={logo}
              alt="Logo Gestionale Finanziario"
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                border: '3px solid rgba(255,255,255,0.2)',
              }}
            />
          </Box>
          
          <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
            Gestionale Finanziario
          </Typography>
          <Typography variant="h6" color="white" sx={{ opacity: 0.9, fontWeight: 300 }}>
            Sistema di Gestione AI Avanzato
          </Typography>
          <Typography variant="body1" color="white" sx={{ mt: 1, opacity: 0.8 }}>
            Accedi al tuo account
          </Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                },
              }}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Credenziali demo: admin@bank.com / password
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;

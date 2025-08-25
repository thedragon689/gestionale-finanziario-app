import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  Typography,
  Button,
  Chip,
  useTheme
} from '@mui/material';
import {
  Warning,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  NotificationsActive
} from '@mui/icons-material';
import { MarketAlert } from '../../services/aiNewsService';

interface NewsAlertNotificationProps {
  alert: MarketAlert;
  open: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

export const NewsAlertNotification: React.FC<NewsAlertNotificationProps> = ({
  alert,
  open,
  onClose,
  onViewDetails
}) => {
  const theme = useTheme();
  const [autoHide, setAutoHide] = useState(true);

  useEffect(() => {
    if (open && autoHide) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000); // Auto-hide dopo 10 secondi

      return () => clearTimeout(timer);
    }
  }, [open, autoHide, onClose]);

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'risk_warning':
        return <Warning sx={{ color: 'error.main' }} />;
      case 'opportunity':
        return <Lightbulb sx={{ color: 'success.main' }} />;
      case 'price_movement':
        return <TrendingUp sx={{ color: 'info.main' }} />;
      default:
        return <NotificationsActive sx={{ color: 'warning.main' }} />;
    }
  };

  const getAlertColor = () => {
    switch (alert.severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'success';
    }
  };

  const getAlertTitle = () => {
    switch (alert.type) {
      case 'risk_warning':
        return '⚠️ Allerta Rischio';
      case 'opportunity':
        return '💡 Opportunità';
      case 'price_movement':
        return '📈 Movimento Prezzi';
      default:
        return '📢 Notifica';
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ maxWidth: 400 }}
    >
      <Alert
        severity={getAlertColor()}
        icon={getAlertIcon()}
        onClose={onClose}
        sx={{ 
          width: '100%',
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>
          {getAlertTitle()}
        </AlertTitle>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {alert.title}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            {alert.description}
          </Typography>
          
          {alert.affectedAssets.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Asset coinvolti:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {alert.affectedAssets.map((asset, index) => (
                  <Chip
                    key={index}
                    label={asset}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip 
              label={alert.severity} 
              size="small" 
              color={getAlertColor()}
            />
            <Chip 
              label={alert.type} 
              size="small" 
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={onViewDetails}
              sx={{ flex: 1 }}
            >
              Vedi Dettagli
            </Button>
            <Button
              size="small"
              variant="text"
              onClick={onClose}
            >
              Chiudi
            </Button>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  );
};

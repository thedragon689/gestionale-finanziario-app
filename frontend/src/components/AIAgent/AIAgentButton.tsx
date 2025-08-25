import React, { useState } from 'react';
import { Fab, Tooltip, Badge, Box } from '@mui/material';
import { AIAgent } from './AIAgent';
import './AIAgentButton.css';

export const AIAgentButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Simula notifiche (in un'implementazione reale, questo verrebbe dal sistema)
  React.useEffect(() => {
    const checkNotifications = () => {
      // Simula notifiche ogni 30 secondi
      const interval = setInterval(() => {
        setHasNotifications(Math.random() > 0.7); // 30% di probabilità di notifica
      }, 30000);
      
      return () => clearInterval(interval);
    };
    
    checkNotifications();
  }, []);

  // Stili CSS per le animazioni
  const pulseAnimation = `
    @keyframes pulse {
      0% {
        opacity: 0.7;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
      100% {
        opacity: 0.7;
        transform: scale(1);
      }
    }
  `;

  return (
    <>
      <style>{pulseAnimation}</style>
      <Tooltip 
        title={
          <Box sx={{ textAlign: 'center', p: 1 }}>
            <Box sx={{ fontWeight: 'bold', mb: 1 }}>🤖 Assistente AI</Box>
            <Box sx={{ fontSize: '0.8rem' }}>Chiedi aiuto e consulta le FAQ</Box>
            {hasNotifications && (
              <Box sx={{ 
                fontSize: '0.8rem', 
                color: '#ff1744', 
                fontWeight: 'bold',
                mt: 1,
                p: 0.5,
                bgcolor: 'rgba(255, 23, 68, 0.1)',
                borderRadius: 1
              }}>
                ⚠️ Hai notifiche importanti!
              </Box>
            )}
            <Box sx={{ fontSize: '0.7rem', opacity: 0.8, mt: 1 }}>
              📞 Call Center: +39 800 123 456
            </Box>
          </Box>
        } 
        placement="left"
        arrow
        sx={{
          '& .MuiTooltip-tooltip': {
            bgcolor: 'rgba(0,0,0,0.9)',
            color: 'white',
            fontSize: '0.875rem',
            maxWidth: 200,
            p: 2
          }
        }}
        classes={{
          tooltip: 'ai-tooltip'
        }}
      >
        <Fab
          color="primary"
          aria-label="Assistente AI"
          onClick={handleOpen}
          className="ai-agent-fab"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              transform: 'scale(1.05) translateY(-2px)',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
            },
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <Badge
            badgeContent={hasNotifications ? "!" : "AI"}
            color={hasNotifications ? "error" : "secondary"}
            className={hasNotifications ? "ai-notification-badge error" : "ai-notification-badge"}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: hasNotifications ? '0.8rem' : '0.7rem',
                fontWeight: 'bold',
                height: hasNotifications ? 20 : 18,
                minWidth: hasNotifications ? 20 : 18,
                background: hasNotifications 
                  ? 'linear-gradient(45deg, #ff1744, #ff5722)' 
                  : 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                boxShadow: hasNotifications 
                  ? '0 2px 8px rgba(255, 23, 68, 0.4)' 
                  : '0 2px 8px rgba(255, 107, 107, 0.3)',
                animation: hasNotifications ? 'pulse 1s infinite' : 'none'
              }
            }}
          >
            {/* Icona AI personalizzata minimal */}
            <Box className="ai-icon-container">
              {/* Cerchio esterno */}
              <Box className="ai-icon-outer" />
              {/* Punti di connessione */}
              <Box className="ai-icon-connection-points" />
            </Box>
          </Badge>
        </Fab>
      </Tooltip>

      <AIAgent open={isOpen} onClose={handleClose} />
    </>
  );
};

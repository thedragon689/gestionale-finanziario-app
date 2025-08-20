import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import { ContentCopy, Visibility, VisibilityOff } from '@mui/icons-material';
// QRCode placeholder - replace with actual QR code library
const QRCode = ({ value, size, level, includeMargin }: any) => (
  <div style={{ 
    width: size, 
    height: size, 
    backgroundColor: '#f0f0f0', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    border: '1px solid #ccc'
  }}>
    <span style={{ fontSize: '12px', color: '#666' }}>QR Code</span>
  </div>
);

interface WalletDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  wallet: {
    id: string;
    name: string;
    type: string;
    address: string;
    balance: number;
    currency: string;
  };
}

const WalletDetailsDialog: React.FC<WalletDetailsDialogProps> = ({
  open,
  onClose,
  wallet,
}) => {
  const [showAddress, setShowAddress] = React.useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Wallet Details</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {wallet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {wallet.type.toUpperCase()} Wallet
              </Typography>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {wallet.balance} {wallet.currency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available Balance
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Wallet Address
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      bgcolor: 'grey.100',
                      p: 1,
                      borderRadius: 1,
                      maxWidth: 200,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {showAddress ? wallet.address : '••••••••••••••••••••••••••••••••'}
                  </Typography>
                  <Tooltip title={showAddress ? 'Hide address' : 'Show address'}>
                    <IconButton
                      size="small"
                      onClick={() => setShowAddress(!showAddress)}
                    >
                      {showAddress ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy address">
                    <IconButton size="small" onClick={handleCopyAddress}>
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                QR Code
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Scan to get wallet address
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <QRCode
                  value={wallet.address}
                  size={200}
                  level="M"
                  includeMargin
                />
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Use this QR code to share your wallet address
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WalletDetailsDialog;

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
} from '@mui/material';

interface SendCryptoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { toAddress: string; amount: number; fee?: number }) => Promise<void>;
  walletBalance: number;
  currency: string;
}

const SendCryptoDialog: React.FC<SendCryptoDialogProps> = ({
  open,
  onClose,
  onSubmit,
  walletBalance,
  currency,
}) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('0.0001');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!toAddress || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (numAmount > walletBalance) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onSubmit({
        toAddress,
        amount: numAmount,
        fee: parseFloat(fee),
      });
      handleClose();
    } catch (error) {
      setError('Failed to send transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setToAddress('');
    setAmount('');
    setFee('0.0001');
    setLoading(false);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send {currency}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Available balance: {walletBalance} {currency}
          </Typography>

          <TextField
            fullWidth
            label="Recipient Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            margin="normal"
            required
            placeholder="Enter wallet address"
          />
          
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            required
            inputProps={{ min: 0, max: walletBalance, step: 0.0001 }}
            helperText={`Max: ${walletBalance} ${currency}`}
          />
          
          <TextField
            fullWidth
            label="Transaction Fee (optional)"
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            margin="normal"
            inputProps={{ min: 0, step: 0.0001 }}
            helperText="Default fee will be used if not specified"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!toAddress || !amount || loading}
          variant="contained"
        >
          {loading ? 'Sending...' : `Send ${currency}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendCryptoDialog;

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
} from '@mui/material';

interface CreateWalletDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string }) => Promise<void>;
}

const CreateWalletDialog: React.FC<CreateWalletDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !type) return;
    
    setLoading(true);
    try {
      await onSubmit({ name, type });
      handleClose();
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setType('');
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Wallet</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Wallet Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Crypto Type</InputLabel>
            <Select
              value={type}
              label="Crypto Type"
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="bitcoin">Bitcoin (BTC)</MenuItem>
              <MenuItem value="ethereum">Ethereum (ETH)</MenuItem>
              <MenuItem value="cardano">Cardano (ADA)</MenuItem>
              <MenuItem value="polkadot">Polkadot (DOT)</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            A new wallet will be created with a secure address for {type || 'the selected cryptocurrency'}.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!name || !type || loading}
          variant="contained"
        >
          {loading ? 'Creating...' : 'Create Wallet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWalletDialog;

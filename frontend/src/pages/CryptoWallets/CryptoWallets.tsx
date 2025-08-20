import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Container,
  Tabs,
  Tab,
  Paper,
  Alert,
} from '@mui/material';
import {
  Add,
  AccountBalanceWallet,
  Send,
  Visibility,
  Refresh,
  MoreVert,
  Security,
  TrendingUp,
  Pending,
} from '@mui/icons-material';
// Mock data - replace with actual API calls

// Services
import { cryptoService } from '../../services/cryptoService';

// Components
import CreateWalletDialog from '../../components/CryptoWallets/CreateWalletDialog';
import SendCryptoDialog from '../../components/CryptoWallets/SendCryptoDialog';
import WalletDetailsDialog from '../../components/CryptoWallets/WalletDetailsDialog';
import TransactionHistory from '../../components/CryptoWallets/TransactionHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`crypto-tabpanel-${index}`}
      aria-labelledby={`crypto-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const CryptoWallets: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [selectedWalletForSend, setSelectedWalletForSend] = useState<any>(null);

  // Mock data - replace with actual API calls
  const isLoading = false;
  const error = null;
  const transactions: any[] = [];

  const handleCreateWallet = async (data: { name: string; type: string }) => {
    console.log('Creating wallet:', data);
    // Mock implementation
  };

  const handleSendCrypto = async (data: { toAddress: string; amount: number; fee?: number }) => {
    console.log('Sending crypto:', data);
    // Mock implementation
  };

  const handleWalletAction = (wallet: any, action: string) => {
    switch (action) {
      case 'details':
        setSelectedWallet(wallet);
        setDetailsDialogOpen(true);
        break;
      case 'send':
        setSelectedWalletForSend(wallet);
        setSendDialogOpen(true);
        break;
      case 'sync':
        cryptoService.syncWallet(wallet.id);
        break;
    }
  };

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load crypto wallets
        </Alert>
      </Container>
    );
  }

  const mockData = {
    wallets: [
      {
        id: '1',
        name: 'Bitcoin Wallet',
        type: 'bitcoin',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        balance: 0.5,
        currency: 'BTC',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        lastSync: new Date(),
      },
      {
        id: '2',
        name: 'Ethereum Wallet',
        type: 'ethereum',
        address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        balance: 2.5,
        currency: 'ETH',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        lastSync: new Date(),
      },
    ],
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Crypto Wallets
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Wallet
          </Button>
        </Box>

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="crypto wallet tabs"
          >
            <Tab label="Wallets" />
            <Tab label="Transactions" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          {/* Wallets Grid */}
          <Grid container spacing={3}>
            {mockData.wallets.map((wallet) => (
              <Grid item xs={12} md={6} lg={4} key={wallet.id}>
                <div>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {wallet.name}
                          </Typography>
                          <Chip
                            label={wallet.type.toUpperCase()}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {wallet.balance} {wallet.currency}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available Balance
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
                        {wallet.address.substring(0, 16)}...
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleWalletAction(wallet, 'details')}
                        >
                          Details
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<Send />}
                          onClick={() => handleWalletAction(wallet, 'send')}
                          disabled={wallet.balance <= 0}
                        >
                          Send
                        </Button>
                        <IconButton
                          size="small"
                          onClick={() => handleWalletAction(wallet, 'sync')}
                        >
                          <Refresh />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                                 </div>
               </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TransactionHistory
            transactions={transactions || []}
            loading={isLoading}
          />
        </TabPanel>
      </Box>

      {/* Dialogs */}
      <CreateWalletDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateWallet}
      />

      <SendCryptoDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        onSubmit={handleSendCrypto}
        walletBalance={selectedWalletForSend?.balance || 0}
        currency={selectedWalletForSend?.currency || ''}
      />

      {selectedWallet && (
        <WalletDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          wallet={selectedWallet}
        />
      )}
    </Container>
  );
};

export default CryptoWallets;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Search,
  Add,
  Visibility,
  Edit,
  Delete,
  AccountBalance,
  CreditCard,
  Savings,
  Business,
  Euro,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

// Services
import { accountService, Account } from '../../services/accountService';

const Accounts: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAccountDialogOpen, setNewAccountDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // New account form state
  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    type: 'checking' as Account['type'],
    status: 'active' as Account['status'],
    balance: '',
    currency: 'EUR',
    description: '',
    holderName: '',
    bankName: ''
  });

  // Load accounts data
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        const data = await accountService.getAccounts();
        setAccounts(data);
        setError(null);
      } catch (err) {
        setError('Errore nel caricamento dei conti');
        console.error('Failed to load accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return <AccountBalance color="primary" />;
      case 'savings':
        return <Savings color="success" />;
      case 'credit':
        return <CreditCard color="warning" />;
      case 'business':
        return <Business color="info" />;
      default:
        return <AccountBalance />;
    }
  };

  const getStatusColor = (status: Account['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'EUR':
        return <Euro />;
      case 'USD':
        return <Euro />; // Using Euro icon for USD as well
      default:
        return <Euro />;
    }
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    const matchesType = typeFilter === 'all' || account.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedAccounts = filteredAccounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = {
    total: accounts.length,
    active: accounts.filter(a => a.status === 'active').length,
    totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
    totalTransactions: accounts.reduce((sum, a) => sum + a.monthlyTransactions, 0),
  };

  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account);
    setDialogOpen(true);
  };

  const handleNewAccount = () => {
    setNewAccountDialogOpen(true);
  };

  const handleCreateAccount = async () => {
    try {
      const accountData = {
        ...newAccount,
        balance: parseFloat(newAccount.balance) || 0,
        id: Date.now().toString(), // Temporary ID
        name: newAccount.description || `Conto ${newAccount.type}`,
        iban: `IT${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        creditLimit: newAccount.type === 'credit' ? 5000 : undefined,
        interestRate: newAccount.type === 'savings' ? 1.5 : undefined,
        monthlyTransactions: 0,
        createdAt: new Date().toISOString()
      };

      // Salva nel servizio
      const createdAccount = await accountService.createAccount(accountData);
      
      // Salva anche nel localStorage per persistenza locale
      const existingAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const updatedAccounts = [...existingAccounts, createdAccount];
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      
      // Aggiorna lo stato locale
      setAccounts([...accounts, createdAccount]);
      setNewAccountDialogOpen(false);
      
      // Reset form
      setNewAccount({
        accountNumber: '',
        type: 'checking',
        status: 'active',
        balance: '',
        currency: 'EUR',
        description: '',
        holderName: '',
        bankName: ''
      });
      
      // Mostra messaggio di successo
      setSuccessMessage('Conto creato e salvato permanentemente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Errore nella creazione del conto');
      console.error('Failed to create account:', err);
    }
  };

  const handleCancelNewAccount = () => {
    setNewAccountDialogOpen(false);
    setNewAccount({
      accountNumber: '',
      type: 'checking',
      status: 'active',
      balance: '',
      currency: 'EUR',
      description: '',
      holderName: '',
      bankName: ''
    });
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography variant="h6">Caricamento conti...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Conti Bancari
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Conti Bancari
        </Typography>

        {/* Success Message */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Totale Conti
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Conti Attivi
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.active}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Saldo Totale
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  €{stats.totalBalance.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Transazioni Mensili
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {stats.totalTransactions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Cerca conti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Stato</InputLabel>
                <Select
                  value={statusFilter}
                  label="Stato"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tutti</MenuItem>
                  <MenuItem value="active">Attivi</MenuItem>
                  <MenuItem value="inactive">Inattivi</MenuItem>
                  <MenuItem value="suspended">Sospesi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={typeFilter}
                  label="Tipo"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">Tutti</MenuItem>
                  <MenuItem value="checking">Conto Corrente</MenuItem>
                  <MenuItem value="savings">Conto Risparmio</MenuItem>
                  <MenuItem value="credit">Carta di Credito</MenuItem>
                  <MenuItem value="business">Conto Aziendale</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleNewAccount}
                sx={{ mb: 2 }}
              >
                Nuovo Conto
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Accounts Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Conto</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Numero Conto</TableCell>
                  <TableCell>Saldo</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Ultima Transazione</TableCell>
                  <TableCell>Transazioni Mensili</TableCell>
                  <TableCell>Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAccounts.map((account) => (
                  <TableRow key={account.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ color: 'primary.main' }}>
                          {getAccountIcon(account.type)}
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {account.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {account.iban}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          account.type === 'checking' ? 'Conto Corrente' :
                          account.type === 'savings' ? 'Conto Risparmio' :
                          account.type === 'credit' ? 'Carta di Credito' :
                          'Conto Aziendale'
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {account.accountNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCurrencyIcon(account.currency)}
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          color={account.balance >= 0 ? 'success.main' : 'error.main'}
                        >
                          {account.balance >= 0 ? '+' : ''}
                          {account.balance.toLocaleString()} {account.currency}
                        </Typography>
                      </Box>
                      {account.creditLimit && (
                        <Typography variant="caption" color="textSecondary">
                          Limite: {account.creditLimit.toLocaleString()} {account.currency}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={account.status}
                        size="small"
                        color={getStatusColor(account.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {account.lastTransaction.toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {account.lastTransaction.toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {account.monthlyTransactions}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewAccount(account)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="secondary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAccounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Righe per pagina:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} di ${count !== -1 ? count : `più di ${to}`}`
            }
          />
        </Paper>

        {/* Account Details Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Dettagli Conto - {selectedAccount?.name}
          </DialogTitle>
          <DialogContent>
            {selectedAccount && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Informazioni Conto
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Nome Conto</Typography>
                      <Typography variant="body1">{selectedAccount.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Numero Conto</Typography>
                      <Typography variant="body1" fontFamily="monospace">{selectedAccount.accountNumber}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">IBAN</Typography>
                      <Typography variant="body1" fontFamily="monospace">{selectedAccount.iban}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Tipo</Typography>
                      <Chip
                        label={
                          selectedAccount.type === 'checking' ? 'Conto Corrente' :
                          selectedAccount.type === 'savings' ? 'Conto Risparmio' :
                          selectedAccount.type === 'credit' ? 'Carta di Credito' :
                          'Conto Aziendale'
                        }
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Informazioni Finanziarie
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Saldo Attuale</Typography>
                      <Typography variant="h5" color="primary.main" fontWeight="bold">
                        {selectedAccount.balance >= 0 ? '+' : ''}
                        {selectedAccount.balance.toLocaleString()} {selectedAccount.currency}
                      </Typography>
                    </Box>
                    {selectedAccount.creditLimit && (
                      <Box>
                        <Typography variant="body2" color="textSecondary">Limite di Credito</Typography>
                        <Typography variant="body1">
                          {selectedAccount.creditLimit.toLocaleString()} {selectedAccount.currency}
                        </Typography>
                      </Box>
                    )}
                    {selectedAccount.interestRate && (
                      <Box>
                        <Typography variant="body2" color="textSecondary">Tasso di Interesse</Typography>
                        <Typography variant="body1">{selectedAccount.interestRate}%</Typography>
                      </Box>
                    )}
                    <Box>
                      <Typography variant="body2" color="textSecondary">Stato</Typography>
                      <Chip
                        label={selectedAccount.status}
                        color={getStatusColor(selectedAccount.status) as any}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Transazioni Mensili</Typography>
                      <Typography variant="body1">{selectedAccount.monthlyTransactions}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Chiudi</Button>
            <Button variant="contained">Modifica</Button>
          </DialogActions>
        </Dialog>

        {/* New Account Dialog */}
        <Dialog open={newAccountDialogOpen} onClose={handleCancelNewAccount} maxWidth="md" fullWidth>
          <DialogTitle>
            Nuovo Conto Bancario
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Numero Conto"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Nome Intestatario"
                  value={newAccount.holderName}
                  onChange={(e) => setNewAccount({...newAccount, holderName: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Nome Banca"
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Descrizione"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                  margin="normal"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Tipo Conto</InputLabel>
                  <Select
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({...newAccount, type: e.target.value as Account['type']})}
                    label="Tipo Conto"
                  >
                    <MenuItem value="checking">Conto Corrente</MenuItem>
                    <MenuItem value="savings">Conto Risparmio</MenuItem>
                    <MenuItem value="credit">Carta di Credito</MenuItem>
                    <MenuItem value="business">Conto Aziendale</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Stato</InputLabel>
                  <Select
                    value={newAccount.status}
                    onChange={(e) => setNewAccount({...newAccount, status: e.target.value as Account['status']})}
                    label="Stato"
                  >
                    <MenuItem value="active">Attivo</MenuItem>
                    <MenuItem value="inactive">Inattivo</MenuItem>
                    <MenuItem value="suspended">Sospeso</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Saldo Iniziale"
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Valuta</InputLabel>
                  <Select
                    value={newAccount.currency}
                    onChange={(e) => setNewAccount({...newAccount, currency: e.target.value})}
                    label="Valuta"
                  >
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelNewAccount}>Annulla</Button>
            <Button 
              onClick={handleCreateAccount} 
              variant="contained"
              disabled={!newAccount.accountNumber || !newAccount.holderName || !newAccount.bankName}
            >
              Crea Conto
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Accounts;
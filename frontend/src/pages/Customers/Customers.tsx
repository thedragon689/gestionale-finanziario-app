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
  Avatar,
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
  Person,
  Business,
  Email,
  Phone,
  LocationOn,
  AccountBalance,
} from '@mui/icons-material';

// Services
import { customerService, Customer } from '../../services/customerService';

const Customers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customers data
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        setError('Errore nel caricamento dei clienti');
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const getStatusColor = (status: Customer['status']) => {
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

  const getTypeIcon = (type: Customer['type']) => {
    return type === 'individual' ? <Person /> : <Business />;
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesType = typeFilter === 'all' || customer.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedCustomers = filteredCustomers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    suspended: customers.filter(c => c.status === 'suspended').length,
    totalBalance: customers.reduce((sum, c) => sum + c.totalBalance, 0),
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography variant="h6">Caricamento clienti...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Clienti
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
          Clienti
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Totale Clienti
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
                  Attivi
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
                  Sospesi
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {stats.suspended}
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
                placeholder="Cerca clienti..."
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
                  <MenuItem value="individual">Privati</MenuItem>
                  <MenuItem value="business">Aziende</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                sx={{ py: 1.5 }}
              >
                Nuovo Cliente
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Customers Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Contatti</TableCell>
                  <TableCell>Saldo Totale</TableCell>
                  <TableCell>Conti</TableCell>
                  <TableCell>Stato</TableCell>
                  <TableCell>Ultima Attività</TableCell>
                  <TableCell>Azioni</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedCustomers.map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: customer.type === 'business' ? 'primary.main' : 'secondary.main' }}>
                          {getTypeIcon(customer.type)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {customer.taxCode}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.type === 'individual' ? 'Privato' : 'Azienda'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Email fontSize="small" />
                          {customer.email}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Phone fontSize="small" />
                          {customer.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        €{customer.totalBalance.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.accounts} conti
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={customer.status}
                        size="small"
                        color={getStatusColor(customer.status) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {customer.lastActivity.toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {customer.lastActivity.toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewCustomer(customer)}
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
            count={filteredCustomers.length}
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

        {/* Customer Details Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Dettagli Cliente - {selectedCustomer?.name}
          </DialogTitle>
          <DialogContent>
            {selectedCustomer && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Informazioni Personali
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Nome</Typography>
                      <Typography variant="body1">{selectedCustomer.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{selectedCustomer.email}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Telefono</Typography>
                      <Typography variant="body1">{selectedCustomer.phone}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Indirizzo</Typography>
                      <Typography variant="body1">{selectedCustomer.address}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Informazioni Bancarie
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Saldo Totale</Typography>
                      <Typography variant="h5" color="primary.main" fontWeight="bold">
                        €{selectedCustomer.totalBalance.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Numero Conti</Typography>
                      <Typography variant="body1">{selectedCustomer.accounts}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Stato</Typography>
                      <Chip
                        label={selectedCustomer.status}
                        color={getStatusColor(selectedCustomer.status) as any}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Ultima Attività</Typography>
                      <Typography variant="body1">
                        {selectedCustomer.lastActivity.toLocaleString()}
                      </Typography>
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
      </Box>
    </Container>
  );
};

export default Customers;

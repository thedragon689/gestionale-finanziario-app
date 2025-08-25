import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  Security,
  DirectionsCar,
  AccountBalance,
  Warning,
  Favorite,
  Search,
  Add,
  Visibility,
  Edit,
  Delete,
} from '@mui/icons-material';

interface Insurance {
  id: string;
  type: 'auto' | 'pension' | 'risk' | 'life';
  name: string;
  customerName: string;
  customerType: 'individual' | 'business';
  policyNumber: string;
  startDate: Date;
  endDate: Date;
  premium: number;
  coverage: number;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  lastPayment: Date;
  nextPayment: Date;
  claims: number;
  totalClaimsAmount: number;
}

const Insurance: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPolicyDialogOpen, setNewPolicyDialogOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    type: 'auto' as Insurance['type'],
    name: '',
    customerName: '',
    customerType: 'individual' as 'individual' | 'business',
    policyNumber: '',
    startDate: new Date(),
    endDate: new Date(),
    premium: 0,
    coverage: 0,
  });

  const [insurances, setInsurances] = useState<Insurance[]>([
    // 3 Assicurazioni Auto
    {
      id: '1',
      type: 'auto',
      name: 'Polizza Auto Completa',
      customerName: 'Mario Rossi',
      customerType: 'individual',
      policyNumber: 'AUTO-001-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 450,
      coverage: 50000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '2',
      type: 'auto',
      name: 'Polizza Auto Business',
      customerName: 'Tech Solutions SpA',
      customerType: 'business',
      policyNumber: 'AUTO-002-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 1200,
      coverage: 150000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 1,
      totalClaimsAmount: 2500,
    },
    {
      id: '3',
      type: 'auto',
      name: 'Polizza Auto Famiglia',
      customerName: 'Giulia Bianchi',
      customerType: 'individual',
      policyNumber: 'AUTO-003-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 680,
      coverage: 75000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    // 3 Assicurazioni Pensione
    {
      id: '4',
      type: 'pension',
      name: 'Piano Pensionistico Individuale',
      customerName: 'Roberto Ferrari',
      customerType: 'individual',
      policyNumber: 'PENS-001-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2044-12-31'),
      premium: 200,
      coverage: 500000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '5',
      type: 'pension',
      name: 'Fondo Pensione Aziendale',
      customerName: 'Construction Company EdilPro',
      customerType: 'business',
      policyNumber: 'PENS-002-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2044-12-31'),
      premium: 500,
      coverage: 2000000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '6',
      type: 'pension',
      name: 'Piano Pensionistico Libero',
      customerName: 'Sofia Conti',
      customerType: 'individual',
      policyNumber: 'PENS-003-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2044-12-31'),
      premium: 150,
      coverage: 300000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    // 3 Assicurazioni di Rischio
    {
      id: '7',
      type: 'risk',
      name: 'Polizza Responsabilità Civile',
      customerName: 'Law Firm Studio Legale',
      customerType: 'business',
      policyNumber: 'RISK-001-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 800,
      coverage: 1000000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '8',
      type: 'risk',
      name: 'Polizza Infortuni',
      customerName: 'Marco Neri',
      customerType: 'individual',
      policyNumber: 'RISK-002-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 120,
      coverage: 100000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '9',
      type: 'risk',
      name: 'Polizza Cyber Risk',
      customerName: 'Software House CodeLab',
      customerType: 'business',
      policyNumber: 'RISK-003-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 1500,
      coverage: 2000000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    // 4 Assicurazioni Vita
    {
      id: '10',
      type: 'life',
      name: 'Polizza Vita Mista',
      customerName: 'Antonio Russo',
      customerType: 'individual',
      policyNumber: 'LIFE-001-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2044-12-31'),
      premium: 300,
      coverage: 300000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '11',
      type: 'life',
      name: 'Polizza Vita Temporanea',
      customerName: 'Elena Santini',
      customerType: 'individual',
      policyNumber: 'LIFE-002-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2044-12-31'),
      premium: 180,
      coverage: 200000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '12',
      type: 'life',
      name: 'Polizza Vita Universale',
      customerName: 'Giuseppe Romano',
      customerType: 'individual',
      policyNumber: 'LIFE-003-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2044-12-31'),
      premium: 400,
      coverage: 500000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
    {
      id: '13',
      type: 'life',
      name: 'Polizza Vita Aziendale',
      customerName: 'Hotel Luxury Palace',
      customerType: 'business',
      policyNumber: 'LIFE-004-2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2044-12-31'),
      premium: 600,
      coverage: 1000000,
      status: 'active',
      lastPayment: new Date('2024-01-01'),
      nextPayment: new Date('2024-02-01'),
      claims: 0,
      totalClaimsAmount: 0,
    },
  ]);

  const getInsuranceIcon = (type: Insurance['type']) => {
    switch (type) {
      case 'auto':
        return <DirectionsCar color="primary" />;
      case 'pension':
        return <AccountBalance color="success" />;
      case 'risk':
        return <Warning color="warning" />;
      case 'life':
        return <Favorite color="error" />;
      default:
        return <Security />;
    }
  };

  const getStatusColor = (status: Insurance['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: Insurance['type']) => {
    switch (type) {
      case 'auto':
        return 'Auto';
      case 'pension':
        return 'Pensione';
      case 'risk':
        return 'Rischio';
      case 'life':
        return 'Vita';
      default:
        return type;
    }
  };

  const filteredInsurances = insurances.filter((insurance) => {
    const matchesSearch = insurance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insurance.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insurance.policyNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || insurance.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || insurance.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const paginatedInsurances = filteredInsurances.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const stats = {
    total: insurances.length,
    auto: insurances.filter(i => i.type === 'auto').length,
    pension: insurances.filter(i => i.type === 'pension').length,
    risk: insurances.filter(i => i.type === 'risk').length,
    life: insurances.filter(i => i.type === 'life').length,
    active: insurances.filter(i => i.status === 'active').length,
    totalPremium: insurances.reduce((sum, i) => sum + i.premium, 0),
    totalCoverage: insurances.reduce((sum, i) => sum + i.coverage, 0),
  };

  const handleViewInsurance = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setDialogOpen(true);
  };

  const handleCreateNewPolicy = () => {
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    setNewPolicy({
      type: 'auto',
      name: '',
      customerName: '',
      customerType: 'individual',
      policyNumber: '',
      startDate: today,
      endDate: nextYear,
      premium: 0,
      coverage: 0,
    });
    setNewPolicyDialogOpen(true);
  };

  const handleSaveNewPolicy = () => {
    // Genera un nuovo ID
    const newId = (insurances.length + 1).toString();
    
    // Genera un numero di polizza automatico
    const policyNumber = `${newPolicy.type.toUpperCase()}-${String(newId).padStart(3, '0')}-${new Date().getFullYear()}`;
    
    // Crea la nuova polizza
    const newInsurance: Insurance = {
      id: newId,
      type: newPolicy.type,
      name: newPolicy.name,
      customerName: newPolicy.customerName,
      customerType: newPolicy.customerType,
      policyNumber: policyNumber,
      startDate: newPolicy.startDate,
      endDate: newPolicy.endDate,
      premium: newPolicy.premium,
      coverage: newPolicy.coverage,
      status: 'active',
      lastPayment: new Date(),
      nextPayment: new Date(newPolicy.startDate.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 giorni
      claims: 0,
      totalClaimsAmount: 0,
    };

    // Aggiungi alla lista usando setState
    setInsurances(prevInsurances => [...prevInsurances, newInsurance]);
    
    // Chiudi il dialog e resetta il form
    setNewPolicyDialogOpen(false);
    const today = new Date();
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    
    setNewPolicy({
      type: 'auto',
      name: '',
      customerName: '',
      customerType: 'individual',
      policyNumber: '',
      startDate: today,
      endDate: nextYear,
      premium: 0,
      coverage: 0,
    });
  };

  const generatePolicyNumber = (type: Insurance['type']) => {
    const count = insurances.filter(i => i.type === type).length + 1;
    return `${type.toUpperCase()}-${String(count).padStart(3, '0')}-${new Date().getFullYear()}`;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Gestione Assicurazioni
        </Typography>

        {/* Insurance Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DirectionsCar color="primary" />
                  <Typography color="textSecondary">Auto</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stats.auto}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Polizze Attive
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AccountBalance color="success" />
                  <Typography color="textSecondary">Pensione</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.pension}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Piani Attivi
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Warning color="warning" />
                  <Typography color="textSecondary">Rischio</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.risk}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Polizze Attive
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Favorite color="error" />
                  <Typography color="textSecondary">Vita</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {stats.life}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Polizze Attive
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Financial Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Riepilogo Finanziario
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Premi Totali:</Typography>
                    <Typography fontWeight="bold" color="primary.main">
                      €{stats.totalPremium.toLocaleString()}/mese
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Copertura Totale:</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      €{stats.totalCoverage.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Polizze Attive:</Typography>
                    <Typography fontWeight="bold" color="info.main">
                      {stats.active}/{stats.total}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribuzione per Tipo
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Auto:</Typography>
                    <Typography fontWeight="bold">{stats.auto} polizze</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Pensione:</Typography>
                    <Typography fontWeight="bold">{stats.pension} piani</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Rischio:</Typography>
                    <Typography fontWeight="bold">{stats.risk} polizze</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Vita:</Typography>
                    <Typography fontWeight="bold">{stats.life} polizze</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters - Responsive Design */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search Field - Full width on mobile */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Cerca assicurazioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: { xs: 56, md: 40 }, // Taller on mobile for better touch
                  }
                }}
              />
            </Grid>
            
            {/* Type Filter - Responsive width */}
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={typeFilter}
                  label="Tipo"
                  onChange={(e) => setTypeFilter(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: 56, md: 40 },
                    }
                  }}
                >
                  <MenuItem value="all">Tutti i Tipi</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                  <MenuItem value="pension">Pensione</MenuItem>
                  <MenuItem value="risk">Rischio</MenuItem>
                  <MenuItem value="life">Vita</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Status Filter - Responsive width */}
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Stato</InputLabel>
                <Select
                  value={statusFilter}
                  label="Stato"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: 56, md: 40 },
                    }
                  }}
                >
                  <MenuItem value="all">Tutti gli Stati</MenuItem>
                  <MenuItem value="active">Attive</MenuItem>
                  <MenuItem value="expired">Scadute</MenuItem>
                  <MenuItem value="cancelled">Cancellate</MenuItem>
                  <MenuItem value="pending">In Attesa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* New Policy Button - Responsive width */}
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Add />}
                sx={{ 
                  py: { xs: 2, md: 1.5 }, // Taller on mobile
                  height: { xs: 56, md: 40 },
                  fontSize: { xs: '1rem', md: '0.875rem' }
                }}
                onClick={handleCreateNewPolicy}
              >
                Nuova Polizza
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Insurance Table - Responsive Design */}
        <Paper>
          {/* Desktop Table View */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Polizza</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Premio</TableCell>
                    <TableCell>Copertura</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Prossimo Pagamento</TableCell>
                    <TableCell>Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedInsurances.map((insurance) => (
                    <TableRow key={insurance.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ color: 'primary.main' }}>
                            {getInsuranceIcon(insurance.type)}
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {insurance.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {insurance.policyNumber}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {insurance.customerName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {insurance.customerType === 'individual' ? 'Privato' : 'Azienda'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTypeLabel(insurance.type)}
                          color="primary"
                          size="small"
                          icon={getInsuranceIcon(insurance.type)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          €{insurance.premium.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          €{insurance.coverage.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={insurance.status === 'active' ? 'Attiva' : 
                                 insurance.status === 'expired' ? 'Scaduta' :
                                 insurance.status === 'cancelled' ? 'Cancellata' : 'In Attesa'}
                          color={getStatusColor(insurance.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {insurance.nextPayment.toLocaleDateString('it-IT')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Visualizza Dettagli">
                            <IconButton
                              size="small"
                              onClick={() => handleViewInsurance(insurance)}
                              color="primary"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Box sx={{ p: 2 }}>
              {paginatedInsurances.map((insurance) => (
                <Card key={insurance.id} sx={{ mb: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: 'primary.main' }}>
                        {getInsuranceIcon(insurance.type)}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="medium">
                          {insurance.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {insurance.policyNumber}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={insurance.status === 'active' ? 'Attiva' : 
                             insurance.status === 'expired' ? 'Scaduta' :
                             insurance.status === 'cancelled' ? 'Cancellata' : 'In Attesa'}
                      color={getStatusColor(insurance.status) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Cliente</Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {insurance.customerName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {insurance.customerType === 'individual' ? 'Privato' : 'Azienda'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Tipo</Typography>
                      <Chip
                        label={getTypeLabel(insurance.type)}
                        color="primary"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Premio</Typography>
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        €{insurance.premium.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="textSecondary">Copertura</Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        €{insurance.coverage.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="textSecondary">Prossimo Pagamento</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {insurance.nextPayment.toLocaleDateString('it-IT')}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewInsurance(insurance)}
                    >
                      Dettagli
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredInsurances.length}
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

        {/* Insurance Details Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Dettagli Polizza - {selectedInsurance?.name}
          </DialogTitle>
          <DialogContent>
            {selectedInsurance && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Informazioni Polizza
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Nome Polizza</Typography>
                      <Typography variant="body1">{selectedInsurance.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Numero Polizza</Typography>
                      <Typography variant="body1" fontFamily="monospace">{selectedInsurance.policyNumber}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Tipo</Typography>
                      <Chip
                        label={getTypeLabel(selectedInsurance.type)}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Stato</Typography>
                      <Chip
                        label={selectedInsurance.status}
                        color={getStatusColor(selectedInsurance.status) as any}
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
                      <Typography variant="body2" color="textSecondary">Premio Mensile</Typography>
                      <Typography variant="h5" color="primary.main" fontWeight="bold">
                        €{selectedInsurance.premium.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Copertura</Typography>
                      <Typography variant="h5" color="success.main" fontWeight="bold">
                        €{selectedInsurance.coverage.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Prossimo Pagamento</Typography>
                      <Typography variant="body1">
                        {selectedInsurance.nextPayment.toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">Sinistri</Typography>
                      <Typography variant="body1">
                        {selectedInsurance.claims} (€{selectedInsurance.totalClaimsAmount.toLocaleString()})
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

         {/* New Policy Dialog */}
         <Dialog open={newPolicyDialogOpen} onClose={() => setNewPolicyDialogOpen(false)} maxWidth="md" fullWidth>
           <DialogTitle>
             Nuova Polizza Assicurativa
           </DialogTitle>
           <DialogContent>
             <Grid container spacing={3} sx={{ mt: 1 }}>
               <Grid item xs={12} md={6}>
                 <FormControl fullWidth>
                   <InputLabel>Tipo Assicurazione</InputLabel>
                   <Select
                     value={newPolicy.type}
                     label="Tipo Assicurazione"
                     onChange={(e) => setNewPolicy(prev => ({ ...prev, type: e.target.value as Insurance['type'] }))}
                   >
                     <MenuItem value="auto">Auto</MenuItem>
                     <MenuItem value="pension">Pensione</MenuItem>
                     <MenuItem value="risk">Rischio</MenuItem>
                     <MenuItem value="life">Vita</MenuItem>
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} md={6}>
                 <TextField
                   fullWidth
                   label="Nome Polizza"
                   value={newPolicy.name}
                   onChange={(e) => setNewPolicy(prev => ({ ...prev, name: e.target.value }))}
                   placeholder="Es. Polizza Auto Completa"
                 />
               </Grid>
               <Grid item xs={12} md={6}>
                 <TextField
                   fullWidth
                   label="Nome Cliente"
                   value={newPolicy.customerName}
                   onChange={(e) => setNewPolicy(prev => ({ ...prev, customerName: e.target.value }))}
                   placeholder="Es. Mario Rossi"
                 />
               </Grid>
               <Grid item xs={12} md={6}>
                 <FormControl fullWidth>
                   <InputLabel>Tipo Cliente</InputLabel>
                   <Select
                     value={newPolicy.customerType}
                     label="Tipo Cliente"
                     onChange={(e) => setNewPolicy(prev => ({ ...prev, customerType: e.target.value as 'individual' | 'business' }))}
                   >
                     <MenuItem value="individual">Privato</MenuItem>
                     <MenuItem value="business">Azienda</MenuItem>
                   </Select>
                 </FormControl>
               </Grid>
               <Grid item xs={12} md={6}>
                 <TextField
                   fullWidth
                   label="Data Inizio"
                   type="date"
                   value={newPolicy.startDate.toISOString().split('T')[0]}
                   onChange={(e) => setNewPolicy(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                   InputLabelProps={{ shrink: true }}
                 />
               </Grid>
               <Grid item xs={12} md={6}>
                 <TextField
                   fullWidth
                   label="Data Fine"
                   type="date"
                   value={newPolicy.endDate.toISOString().split('T')[0]}
                   onChange={(e) => setNewPolicy(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                   InputLabelProps={{ shrink: true }}
                 />
               </Grid>
               <Grid item xs={12} md={6}>
                 <TextField
                   fullWidth
                   label="Premio Mensile (€)"
                   type="number"
                   value={newPolicy.premium}
                   onChange={(e) => setNewPolicy(prev => ({ ...prev, premium: Number(e.target.value) }))}
                   placeholder="0"
                   InputProps={{
                     startAdornment: <InputAdornment position="start">€</InputAdornment>,
                   }}
                 />
               </Grid>
               <Grid item xs={12} md={6}>
                 <TextField
                   fullWidth
                   label="Copertura (€)"
                   type="number"
                   value={newPolicy.coverage}
                   onChange={(e) => setNewPolicy(prev => ({ ...prev, coverage: Number(e.target.value) }))}
                   placeholder="0"
                   InputProps={{
                     startAdornment: <InputAdornment position="start">€</InputAdornment>,
                   }}
                 />
               </Grid>
               <Grid item xs={12}>
                 <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                   <Typography variant="body2" color="textSecondary" gutterBottom>
                     Numero Polizza Generato Automaticamente:
                   </Typography>
                   <Typography variant="h6" fontFamily="monospace" color="primary.main">
                     {generatePolicyNumber(newPolicy.type)}
                   </Typography>
                 </Box>
               </Grid>
             </Grid>
           </DialogContent>
           <DialogActions>
             <Button onClick={() => setNewPolicyDialogOpen(false)}>
               Annulla
             </Button>
             <Button 
               variant="contained" 
               onClick={handleSaveNewPolicy}
               disabled={!newPolicy.name || !newPolicy.customerName || newPolicy.premium <= 0 || newPolicy.coverage <= 0}
             >
               Crea Polizza
             </Button>
           </DialogActions>
         </Dialog>
       </Box>
     </Container>
   );
 };

export default Insurance;

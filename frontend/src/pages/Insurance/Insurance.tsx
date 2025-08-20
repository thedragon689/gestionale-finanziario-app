import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Warning,
  CheckCircle,
  Cancel,
  ExpandMore,
  CarRental,
  Home,
  Pets,
  Person,
  AccountBalance,
  Description,
  Upload,
  Download,
} from '@mui/icons-material';

import { insuranceService, Insurance, InsuranceClaim, InsuranceDocument } from '../../services/insuranceService';

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
      id={`insurance-tabpanel-${index}`}
      aria-labelledby={`insurance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const InsurancePage: React.FC = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [insuranceDetailsDialog, setInsuranceDetailsDialog] = useState(false);
  const [addInsuranceDialog, setAddInsuranceDialog] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [newInsurance, setNewInsurance] = useState({
    type: 'auto' as Insurance['type'],
    name: '',
    provider: '',
    policyNumber: '',
    startDate: new Date(),
    endDate: new Date(),
    premium: 0,
    premiumFrequency: 'yearly' as Insurance['premiumFrequency'],
    coverage: {
      amount: 0,
      currency: 'EUR',
      details: '',
    },
    vehicleInfo: {
      make: '',
      model: '',
      year: 2024,
      licensePlate: '',
      vin: '',
      color: '',
      engineSize: '',
      fuelType: 'gasoline' as const,
    },
    propertyInfo: {
      address: '',
      type: 'house' as const,
      squareMeters: 0,
      constructionYear: 2024,
      propertyValue: 0,
      securityFeatures: [],
    },
    petInfo: {
      name: '',
      species: 'dog' as const,
      breed: '',
      age: 0,
      weight: 0,
      microchipNumber: '',
    },
    beneficiaries: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [insurancesData, statsData] = await Promise.all([
        insuranceService.getInsurances(),
        insuranceService.getInsuranceStats(),
      ]);
      setInsurances(insurancesData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Errore nel caricamento delle assicurazioni');
      console.error('Failed to load insurances:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInsurance = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setInsuranceDetailsDialog(true);
  };

  const handleAddInsurance = async () => {
    try {
      await insuranceService.createInsurance(newInsurance);
      setAddInsuranceDialog(false);
      setNewInsurance({
        type: 'auto',
        name: '',
        provider: '',
        policyNumber: '',
        startDate: new Date(),
        endDate: new Date(),
        premium: 0,
        premiumFrequency: 'yearly',
        coverage: {
          amount: 0,
          currency: 'EUR',
          details: '',
        },
        vehicleInfo: {
          make: '',
          model: '',
          year: 2024,
          licensePlate: '',
          vin: '',
          color: '',
          engineSize: '',
          fuelType: 'gasoline',
        },
        propertyInfo: {
          address: '',
          type: 'house',
          squareMeters: 0,
          constructionYear: 2024,
          propertyValue: 0,
          securityFeatures: [],
        },
        petInfo: {
          name: '',
          species: 'dog',
          breed: '',
          age: 0,
          weight: 0,
          microchipNumber: '',
        },
        beneficiaries: [],
      });
      await loadData();
    } catch (err) {
      console.error('Failed to add insurance:', err);
    }
  };

  const getTypeLabel = (type: Insurance['type']) => {
    const labels: Record<Insurance['type'], string> = {
      auto: 'Auto',
      home: 'Casa',
      pet: 'Animale',
      life: 'Vita',
      pension: 'Pensione',
      health: 'Salute',
      travel: 'Viaggio',
    };
    return labels[type];
  };

  const getTypeIcon = (type: Insurance['type']) => {
    const icons: Record<Insurance['type'], React.ReactNode> = {
      auto: <CarRental />,
      home: <Home />,
      pet: <Pets />,
      life: <Person />,
      pension: <AccountBalance />,
      health: <Person />,
      travel: <Person />,
    };
    return icons[type];
  };

  const getStatusColor = (status: Insurance['status']) => {
    const colors: Record<Insurance['status'], 'success' | 'warning' | 'error' | 'default'> = {
      active: 'success',
      expired: 'warning',
      cancelled: 'error',
      pending: 'default',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Insurance['status']) => {
    const icons: Record<Insurance['status'], React.ReactNode> = {
      active: <CheckCircle />,
      expired: <Warning />,
      cancelled: <Cancel />,
      pending: <Warning />,
    };
    return icons[status];
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getInsurancesByType = (type: Insurance['type']) => {
    return insurances.filter(insurance => insurance.type === type);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Gestione Assicurazioni
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddInsuranceDialog(true)}
          >
            Nuova Assicurazione
          </Button>
        </Box>

        {/* Statistics Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Totale Assicurazioni
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalInsurances}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Premio Totale
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats.totalPremium, 'EUR')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Copertura Totale
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats.totalCoverage, 'EUR')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Scadenza Prossima
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {stats.expiringSoon}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Insurance Tabs */}
        <Card>
          <CardContent>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="insurance tabs">
                <Tab label={`Auto (${getInsurancesByType('auto').length})`} />
                <Tab label={`Casa (${getInsurancesByType('home').length})`} />
                <Tab label={`Animali (${getInsurancesByType('pet').length})`} />
                <Tab label={`Vita (${getInsurancesByType('life').length})`} />
                <Tab label={`Pensione (${getInsurancesByType('pension').length})`} />
                <Tab label={`Tutte (${insurances.length})`} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <InsuranceTable insurances={getInsurancesByType('auto')} onView={handleViewInsurance} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <InsuranceTable insurances={getInsurancesByType('home')} onView={handleViewInsurance} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <InsuranceTable insurances={getInsurancesByType('pet')} onView={handleViewInsurance} />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <InsuranceTable insurances={getInsurancesByType('life')} onView={handleViewInsurance} />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <InsuranceTable insurances={getInsurancesByType('pension')} onView={handleViewInsurance} />
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <InsuranceTable insurances={insurances} onView={handleViewInsurance} />
            </TabPanel>
          </CardContent>
        </Card>

        {/* Insurance Details Dialog */}
        <Dialog
          open={insuranceDetailsDialog}
          onClose={() => setInsuranceDetailsDialog(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Dettagli Assicurazione: {selectedInsurance?.name}
          </DialogTitle>
          <DialogContent>
            {selectedInsurance && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informazioni Generali
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                          Fornitore: {selectedInsurance.provider}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Numero Polizza: {selectedInsurance.policyNumber}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Data Inizio: {formatDate(selectedInsurance.startDate)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Data Fine: {formatDate(selectedInsurance.endDate)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Premio: {formatCurrency(selectedInsurance.premium, selectedInsurance.coverage.currency)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Frequenza: {selectedInsurance.premiumFrequency === 'monthly' ? 'Mensile' : 
                                     selectedInsurance.premiumFrequency === 'quarterly' ? 'Trimestrale' : 'Annuale'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Copertura: {formatCurrency(selectedInsurance.coverage.amount, selectedInsurance.coverage.currency)}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {selectedInsurance.coverage.details}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Dettagli Specifici
                      </Typography>
                      {selectedInsurance.type === 'auto' && selectedInsurance.vehicleInfo && (
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Marca: {selectedInsurance.vehicleInfo.make}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Modello: {selectedInsurance.vehicleInfo.model}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Anno: {selectedInsurance.vehicleInfo.year}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Targa: {selectedInsurance.vehicleInfo.licensePlate}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Colore: {selectedInsurance.vehicleInfo.color}
                          </Typography>
                        </Box>
                      )}
                      {selectedInsurance.type === 'home' && selectedInsurance.propertyInfo && (
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Indirizzo: {selectedInsurance.propertyInfo.address}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Tipo: {selectedInsurance.propertyInfo.type}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Metri Quadri: {selectedInsurance.propertyInfo.squareMeters}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Anno Costruzione: {selectedInsurance.propertyInfo.constructionYear}
                          </Typography>
                        </Box>
                      )}
                      {selectedInsurance.type === 'pet' && selectedInsurance.petInfo && (
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            Nome: {selectedInsurance.petInfo.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Specie: {selectedInsurance.petInfo.species}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Razza: {selectedInsurance.petInfo.breed}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Età: {selectedInsurance.petInfo.age} anni
                          </Typography>
                        </Box>
                      )}
                      {selectedInsurance.beneficiaries && selectedInsurance.beneficiaries.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Beneficiari:
                          </Typography>
                          {selectedInsurance.beneficiaries.map((beneficiary, index) => (
                            <Typography key={index} variant="body2" color="textSecondary">
                              • {beneficiary}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Documenti
                      </Typography>
                      <List>
                        {selectedInsurance.documents.map((document) => (
                          <ListItem key={document.id}>
                            <ListItemText
                              primary={document.name}
                              secondary={`${document.type} - ${formatDate(document.uploadDate)}`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Sinistri
                      </Typography>
                      {selectedInsurance.claims.length > 0 ? (
                        <List>
                          {selectedInsurance.claims.map((claim) => (
                            <ListItem key={claim.id}>
                              <ListItemText
                                primary={claim.description}
                                secondary={`${formatDate(claim.date)} - ${formatCurrency(claim.amount, selectedInsurance.coverage.currency)}`}
                              />
                              <ListItemSecondaryAction>
                                <Chip
                                  label={claim.status === 'pending' ? 'In Attesa' : 
                                         claim.status === 'approved' ? 'Approvato' :
                                         claim.status === 'rejected' ? 'Rifiutato' : 'Pagato'}
                                  color={claim.status === 'pending' ? 'warning' : 
                                         claim.status === 'approved' ? 'success' :
                                         claim.status === 'rejected' ? 'error' : 'info'}
                                  size="small"
                                />
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Nessun sinistro registrato
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInsuranceDetailsDialog(false)}>Chiudi</Button>
          </DialogActions>
        </Dialog>

        {/* Add Insurance Dialog */}
        <Dialog open={addInsuranceDialog} onClose={() => setAddInsuranceDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Aggiungi Nuova Assicurazione</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo Assicurazione</InputLabel>
                  <Select
                    value={newInsurance.type}
                    onChange={(e) => setNewInsurance(prev => ({ ...prev, type: e.target.value as Insurance['type'] }))}
                    label="Tipo Assicurazione"
                  >
                    <MenuItem value="auto">Auto</MenuItem>
                    <MenuItem value="home">Casa</MenuItem>
                    <MenuItem value="pet">Animale Domestico</MenuItem>
                    <MenuItem value="life">Vita</MenuItem>
                    <MenuItem value="pension">Pensione</MenuItem>
                    <MenuItem value="health">Salute</MenuItem>
                    <MenuItem value="travel">Viaggio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nome Assicurazione"
                  value={newInsurance.name}
                  onChange={(e) => setNewInsurance(prev => ({ ...prev, name: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fornitore"
                  value={newInsurance.provider}
                  onChange={(e) => setNewInsurance(prev => ({ ...prev, provider: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Numero Polizza"
                  value={newInsurance.policyNumber}
                  onChange={(e) => setNewInsurance(prev => ({ ...prev, policyNumber: e.target.value }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Premio"
                  type="number"
                  value={newInsurance.premium}
                  onChange={(e) => setNewInsurance(prev => ({ ...prev, premium: Number(e.target.value) }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Frequenza Premio</InputLabel>
                  <Select
                    value={newInsurance.premiumFrequency}
                    onChange={(e) => setNewInsurance(prev => ({ ...prev, premiumFrequency: e.target.value as Insurance['premiumFrequency'] }))}
                    label="Frequenza Premio"
                  >
                    <MenuItem value="monthly">Mensile</MenuItem>
                    <MenuItem value="quarterly">Trimestrale</MenuItem>
                    <MenuItem value="yearly">Annuale</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Copertura"
                  type="number"
                  value={newInsurance.coverage.amount}
                  onChange={(e) => setNewInsurance(prev => ({ 
                    ...prev, 
                    coverage: { ...prev.coverage, amount: Number(e.target.value) }
                  }))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Valuta</InputLabel>
                  <Select
                    value={newInsurance.coverage.currency}
                    onChange={(e) => setNewInsurance(prev => ({ 
                      ...prev, 
                      coverage: { ...prev.coverage, currency: e.target.value }
                    }))}
                    label="Valuta"
                  >
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dettagli Copertura"
                  multiline
                  rows={3}
                  value={newInsurance.coverage.details}
                  onChange={(e) => setNewInsurance(prev => ({ 
                    ...prev, 
                    coverage: { ...prev.coverage, details: e.target.value }
                  }))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddInsuranceDialog(false)}>Annulla</Button>
            <Button onClick={handleAddInsurance} variant="contained">Aggiungi</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

// Insurance Table Component
interface InsuranceTableProps {
  insurances: Insurance[];
  onView: (insurance: Insurance) => void;
}

const InsuranceTable: React.FC<InsuranceTableProps> = ({ insurances, onView }) => {
  const getTypeIcon = (type: Insurance['type']) => {
    const icons: Record<Insurance['type'], React.ReactNode> = {
      auto: <CarRental />,
      home: <Home />,
      pet: <Pets />,
      life: <Person />,
      pension: <AccountBalance />,
      health: <Person />,
      travel: <Person />,
    };
    return icons[type];
  };

  const getTypeLabel = (type: Insurance['type']) => {
    const labels: Record<Insurance['type'], string> = {
      auto: 'Auto',
      home: 'Casa',
      pet: 'Animale',
      life: 'Vita',
      pension: 'Pensione',
      health: 'Salute',
      travel: 'Viaggio',
    };
    return labels[type];
  };

  const getStatusColor = (status: Insurance['status']) => {
    const colors: Record<Insurance['status'], 'success' | 'warning' | 'error' | 'default'> = {
      active: 'success',
      expired: 'warning',
      cancelled: 'error',
      pending: 'default',
    };
    return colors[status];
  };

  const getStatusIcon = (status: Insurance['status']) => {
    const icons: Record<Insurance['status'], React.ReactNode> = {
      active: <CheckCircle />,
      expired: <Warning />,
      cancelled: <Cancel />,
      pending: <Warning />,
    };
    return icons[status];
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Fornitore</TableCell>
            <TableCell>Premio</TableCell>
            <TableCell>Copertura</TableCell>
            <TableCell>Scadenza</TableCell>
            <TableCell>Stato</TableCell>
            <TableCell>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {insurances.map((insurance) => (
            <TableRow key={insurance.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getTypeIcon(insurance.type)}
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {insurance.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {insurance.policyNumber}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={getTypeLabel(insurance.type)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {insurance.provider}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(insurance.premium, insurance.coverage.currency)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {insurance.premiumFrequency === 'monthly' ? 'Mensile' : 
                   insurance.premiumFrequency === 'quarterly' ? 'Trimestrale' : 'Annuale'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatCurrency(insurance.coverage.amount, insurance.coverage.currency)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(insurance.endDate)}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(insurance.status)}
                  <Chip
                    label={insurance.status === 'active' ? 'Attiva' : 
                           insurance.status === 'expired' ? 'Scaduta' :
                           insurance.status === 'cancelled' ? 'Cancellata' : 'In Attesa'}
                    color={getStatusColor(insurance.status)}
                    size="small"
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Visualizza Dettagli">
                    <IconButton
                      size="small"
                      onClick={() => onView(insurance)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Modifica">
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Elimina">
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InsurancePage;

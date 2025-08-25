import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp,
  Security,
  DataUsage,
  Psychology,
  Analytics,
  Settings,
  Refresh,
  PlayArrow,
  Stop,
  Assessment,
  Shield,
  Lock,
  Visibility,
  BugReport,
  Timeline,
  ShowChart,
  AccountTree,
  Memory,
  Speed,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';
import { AIEnterpriseCore } from './AIEnterpriseCore';
import { DataManagementSystem } from './DataManagementSystem';
import { SecurityComplianceSystem } from './SecurityComplianceSystem';

// ===== INTERFACCE PER LA DASHBOARD =====

interface DashboardState {
  activeTab: number;
  systemHealth: any;
  modelsStatus: any[];
  dataQuality: any;
  securityStatus: any;
  complianceStatus: any;
  isLoading: boolean;
  error: string | null;
}

// ===== COMPONENTE PRINCIPALE DASHBOARD =====

export const AIEnterpriseDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    activeTab: 0,
    systemHealth: null,
    modelsStatus: [],
    dataQuality: null,
    securityStatus: null,
    complianceStatus: null,
    isLoading: true,
    error: null
  });

  const [aiCore] = useState(new AIEnterpriseCore());
  const [dataSystem] = useState(new DataManagementSystem());
  const [securitySystem] = useState(new SecurityComplianceSystem());

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Carica stato iniziale di tutti i sistemi
      const [systemHealth, dataQuality, securityStatus, complianceStatus] = await Promise.all([
        aiCore.getSystemHealth(),
        dataSystem.getSystemStatus(),
        securitySystem.getSystemStatus(),
        securitySystem.generateComplianceReport()
      ]);

      setState(prev => ({
        ...prev,
        systemHealth,
        dataQuality,
        securityStatus,
        complianceStatus,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: (error as Error)?.message || 'Errore sconosciuto'
      }));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setState(prev => ({ ...prev, activeTab: newValue }));
  };

  const handleRefresh = () => {
    initializeDashboard();
  };

  const renderSystemOverview = () => (
    <Grid container spacing={3}>
      {/* Stato Generale Sistema */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <TrendingUp color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Stato Sistema AI</Typography>
            </Box>
            <Typography variant="h4" color="primary" gutterBottom>
              {state.systemHealth?.systemStatus || 'Caricamento...'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Modelli attivi: {state.systemHealth?.activeModels || 0} / {state.systemHealth?.totalModels || 0}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={state.systemHealth?.activeModels ? (state.systemHealth.activeModels / state.systemHealth.totalModels) * 100 : 0}
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Qualità Dati */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <DataUsage color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Qualità Dati</Typography>
            </Box>
            <Typography variant="h4" color="success" gutterBottom>
              {state.dataQuality?.status || 'Caricamento...'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Pipeline attive: {state.dataQuality?.preprocessingPipelines?.length || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Sicurezza */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Security color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Sicurezza</Typography>
            </Box>
            <Typography variant="h4" color="warning" gutterBottom>
              {state.securityStatus?.status || 'Caricamento...'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Policy attive: {state.securityStatus?.securityPolicies?.length || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Compliance */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Shield color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">Compliance</Typography>
            </Box>
            <Typography variant="h4" color="info" gutterBottom>
              {state.complianceStatus?.gdpr?.status || 'Caricamento...'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Regolamenti: GDPR, PSD2, SOX
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderModelsManagement = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Gestione Modelli AI</Typography>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => console.log('Avvia training modelli')}
              >
                Training Batch
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Modello</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Performance</TableCell>
                    <TableCell>Ultimo Training</TableCell>
                    <TableCell>Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(aiCore.getAllModels().entries()).map(([id, model]) => (
                    <TableRow key={id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Memory sx={{ mr: 1 }} />
                          {id.replace(/_/g, ' ').toUpperCase()}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={model.modelType} 
                          size="small"
                          color={model.modelType === 'deep' ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={model.isActive ? 'Attivo' : 'Inattivo'} 
                          size="small"
                          color={model.isActive ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {(model.performanceMetrics.accuracy * 100).toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={model.performanceMetrics.accuracy * 100}
                            sx={{ width: 60, height: 8 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {model.lastTraining.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Retrain">
                            <IconButton size="small" onClick={() => console.log('Retrain', id)}>
                              <Refresh />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={model.isActive ? 'Disattiva' : 'Attiva'}>
                            <IconButton 
                              size="small" 
                              onClick={() => console.log('Toggle', id)}
                              color={model.isActive ? 'error' : 'success'}
                            >
                              {model.isActive ? <Stop /> : <PlayArrow />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderDataPipeline = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pipeline di Preprocessing
            </Typography>
            <List>
              {Array.from(dataSystem.getPreprocessingPipelines().entries()).map(([name, pipeline]) => (
                <ListItem key={name}>
                  <ListItemIcon>
                    <DataUsage color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={name.replace(/_/g, ' ').toUpperCase()}
                    secondary={`${pipeline.steps.length} step - ${pipeline.algorithms ? Object.keys(pipeline.algorithms).length : 0} algoritmi`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feature Engineering
            </Typography>
            <List>
              {Array.from(dataSystem.getFeatureEngineeringRules().entries()).map(([name, rules]) => (
                <ListItem key={name}>
                  <ListItemIcon>
                    <AccountTree color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={name.replace(/_/g, ' ').toUpperCase()}
                    secondary={`${Object.keys(rules).length} categorie di feature`}
                  />
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
              Fonti Dati Integrate
            </Typography>
            <Grid container spacing={2}>
              {Array.from(dataSystem.getDataSources().entries()).map(([name, source]) => (
                <Grid item xs={12} sm={6} md={3} key={name}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {name.replace(/_/g, ' ').toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {source.type}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Aggiornamento: {source.updateFrequency}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSecurityCompliance = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Policy di Sicurezza
            </Typography>
            <List>
              {Array.from(securitySystem.getSecurityPolicies().entries()).map(([name, policy]) => (
                <ListItem key={name}>
                  <ListItemIcon>
                    <Lock color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary={policy.name}
                    secondary={`${policy.rules.length} regole - ${policy.type}`}
                  />
                  <Chip 
                    label={policy.isActive ? 'Attiva' : 'Inattiva'} 
                    size="small"
                    color={policy.isActive ? 'success' : 'error'}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Requisiti Compliance
            </Typography>
            <List>
              {Array.from(securitySystem.getComplianceRequirements().entries()).map(([name, req]) => (
                <ListItem key={name}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${req.regulation} - ${req.article}`}
                    secondary={req.description}
                  />
                  <Chip 
                    label={req.status} 
                    size="small"
                    color={req.status === 'implemented' ? 'success' : 'warning'}
                  />
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
              Audit Trail Recenti
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Azione</TableCell>
                    <TableCell>Risultato</TableCell>
                    <TableCell>Compliance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {securitySystem.getAuditTrails().slice(-10).reverse().map((audit) => (
                    <TableRow key={audit.id}>
                      <TableCell>
                        {audit.timestamp.toLocaleString()}
                      </TableCell>
                      <TableCell>{audit.action}</TableCell>
                      <TableCell>
                        <Chip 
                          label={audit.result} 
                          size="small"
                          color={audit.result === 'success' ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={audit.compliance} 
                          size="small"
                          color={audit.compliance.includes('OK') ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAIAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Metriche Performance AI
            </Typography>
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Accuratezza Media
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={85}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" color="textSecondary">
                85%
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Precisione
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={82}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" color="textSecondary">
                82%
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Recall
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={88}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="caption" color="textSecondary">
                88%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rilevamento Bias
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Gender Bias"
                  secondary="Nessun bias rilevato"
                />
                <Chip label="OK" size="small" color="success" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Age Bias"
                  secondary="Nessun bias rilevato"
                />
                <Chip label="OK" size="small" color="success" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Geographic Bias"
                  secondary="Bias minimo rilevato"
                />
                <Chip label="ATTENZIONE" size="small" color="warning" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trend Performance Modelli
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <Typography variant="body1" color="textSecondary">
                Grafico trend performance modelli AI
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Impostazioni Privacy
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Conservazione Dati"
                  secondary={`${securitySystem.getPrivacySettings().dataRetention} giorni`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Livello Anonimizzazione"
                  secondary={securitySystem.getPrivacySettings().anonymizationLevel}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Livello Crittografia"
                  secondary={securitySystem.getPrivacySettings().encryptionLevel}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Logging Accessi"
                  secondary={securitySystem.getPrivacySettings().accessLogging ? 'Attivo' : 'Inattivo'}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configurazione Sistema
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => console.log('Configura modelli')}
            >
              Configura Modelli AI
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => console.log('Configura pipeline')}
            >
              Configura Pipeline Dati
            </Button>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              onClick={() => console.log('Configura sicurezza')}
            >
              Configura Sicurezza
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => console.log('Configura compliance')}
            >
              Configura Compliance
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  if (state.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (state.error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Errore nel caricamento della dashboard: {state.error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Dashboard */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          🚀 AI Enterprise Dashboard
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Aggiorna
          </Button>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={() => console.log('Impostazioni avanzate')}
          >
            Impostazioni
          </Button>
        </Box>
      </Box>

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={state.activeTab} onChange={handleTabChange}>
          <Tab label="Panoramica" icon={<Analytics />} />
          <Tab label="Modelli AI" icon={<Psychology />} />
          <Tab label="Pipeline Dati" icon={<DataUsage />} />
          <Tab label="Sicurezza & Compliance" icon={<Security />} />
          <Tab label="Analytics AI" icon={<ShowChart />} />
          <Tab label="Impostazioni" icon={<Settings />} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box>
        {state.activeTab === 0 && renderSystemOverview()}
        {state.activeTab === 1 && renderModelsManagement()}
        {state.activeTab === 2 && renderDataPipeline()}
        {state.activeTab === 3 && renderSecurityCompliance()}
        {state.activeTab === 4 && renderAIAnalytics()}
        {state.activeTab === 5 && renderSettings()}
      </Box>
    </Box>
  );
};

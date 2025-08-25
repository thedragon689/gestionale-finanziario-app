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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  LinearProgress,
  Divider,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Security,
  Assessment,
  AutoMode,
  Chat,
  Gavel,
  PersonOutline,
  Refresh,
  Settings,
  Warning,
  CheckCircle,
  Schedule,
  Lightbulb,
  Memory,
  Storage,
  Speed,
  Hub,
  AutoGraph,
  Insights,
  Analytics,
  SmartToy,
} from '@mui/icons-material';

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
      id={`ai-advanced-tabpanel-${index}`}
      aria-labelledby={`ai-advanced-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AIAdvanced: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedModel, setSelectedModel] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const startAdvancedAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const mockPredictiveData = {
    cashFlowAccuracy: 94.2,
    riskPredictionSuccess: 97.8,
    marketTrendAccuracy: 89.5,
    portfolioOptimization: 92.1,
  };

  const mockAutomationData = {
    autoApprovals: 156,
    complianceChecks: 89,
    fraudDetections: 23,
    portfolioOptimizations: 45,
  };

  const mockIntelligenceData = {
    activeModels: 12,
    totalPredictions: 15420,
    accuracyImprovement: 15.3,
    processingSpeed: '2.3ms',
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          AI Advanced - Intelligenza Artificiale Avanzata
        </Typography>

        {/* AI Advanced Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Psychology color="primary" />
                  <Typography color="textSecondary">Modelli Avanzati</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {mockIntelligenceData.activeModels}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  AI Models Attivi
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AutoGraph color="success" />
                  <Typography color="textSecondary">Precisione Media</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {mockPredictiveData.cashFlowAccuracy}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Accuratezza Predittiva
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Speed color="info" />
                  <Typography color="textSecondary">Velocità Elaborazione</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {mockIntelligenceData.processingSpeed}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tempo Medio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="warning" />
                  <Typography color="textSecondary">Miglioramento</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  +{mockIntelligenceData.accuracyImprovement}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Performance YTD
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI Advanced Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Modello AI</InputLabel>
                <Select
                  value={selectedModel}
                  label="Modello AI"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <MenuItem value="all">Tutti i Modelli</MenuItem>
                  <MenuItem value="predictive">Analisi Predittiva</MenuItem>
                  <MenuItem value="automation">Automazione Intelligente</MenuItem>
                  <MenuItem value="intelligence">Business Intelligence</MenuItem>
                  <MenuItem value="optimization">Ottimizzazione Portfolio</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Assessment />}
                  onClick={startAdvancedAnalysis}
                  disabled={isAnalyzing}
                  sx={{ flex: 1 }}
                >
                  {isAnalyzing ? 'Analisi in Corso...' : 'Avvia Analisi Avanzata'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                >
                  Aggiorna Modelli
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                >
                  Configura
                </Button>
              </Box>
            </Grid>
          </Grid>

          {isAnalyzing && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Analisi avanzata in corso... {analysisProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={analysisProgress} />
            </Box>
          )}
        </Paper>

        {/* AI Advanced Tabs */}
        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="AI Advanced tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Analisi Predittiva" icon={<AutoGraph />} />
            <Tab label="Automazione" icon={<AutoMode />} />
            <Tab label="Business Intelligence" icon={<Insights />} />
            <Tab label="Ottimizzazione" icon={<TrendingUp />} />
          </Tabs>

          {/* Predictive Analytics Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Metriche Predittive
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Precisione Flussi di Cassa"
                      secondary={`${mockPredictiveData.cashFlowAccuracy}% - Modello avanzato con ML`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Predizione Rischio Credito"
                      secondary={`${mockPredictiveData.riskPredictionSuccess}% - Rilevamento precoce`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Assessment color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Analisi Trend Mercato"
                      secondary={`${mockPredictiveData.marketTrendAccuracy}% - Pattern recognition`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoGraph color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ottimizzazione Portfolio"
                      secondary={`${mockPredictiveData.portfolioOptimization}% - Asset allocation AI`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Modelli AI Attivi
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="primary.main" gutterBottom>
                        Neural Network v3.2
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Modello di deep learning per previsioni finanziarie avanzate
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip label="Attivo" color="success" size="small" />
                        <Chip label="ML" variant="outlined" size="small" sx={{ ml: 1 }} />
                        <Chip label="Real-time" variant="outlined" size="small" sx={{ ml: 1 }} />
                      </Box>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" color="success.main" gutterBottom>
                        Ensemble Model v2.1
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Combinazione di modelli per massimizzare accuratezza
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Chip label="Attivo" color="success" size="small" />
                        <Chip label="Ensemble" variant="outlined" size="small" sx={{ ml: 1 }} />
                        <Chip label="High Accuracy" variant="outlined" size="small" sx={{ ml: 1 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Automation Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Automazioni Intelligenti
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Approvazioni Automatiche"
                      secondary={`${mockAutomationData.autoApprovals} transazioni approvate oggi`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Gavel color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Controlli Compliance"
                      secondary={`${mockAutomationData.complianceChecks} verifiche completate`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Rilevamento Frodi"
                      secondary={`${mockAutomationData.fraudDetections} tentativi bloccati`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoMode color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ottimizzazioni Portfolio"
                      secondary={`${mockAutomationData.portfolioOptimizations} ribilanciamenti`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Workflow Automatizzati
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        🚀 Approvazione Crediti
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Sistema automatico per approvazione prestiti fino a €50,000
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label="Attivo" color="success" size="small" />
                        <Chip label="24/7" variant="outlined" size="small" sx={{ ml: 1 }} />
                      </Box>
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        🔒 Monitoraggio Sicurezza
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Rilevamento automatico di attività sospette e anomalie
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label="Attivo" color="success" size="small" />
                        <Chip label="Real-time" variant="outlined" size="small" sx={{ ml: 1 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Business Intelligence Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Metriche di Performance
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Memory color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Modelli AI Attivi"
                      secondary={`${mockIntelligenceData.activeModels} modelli in esecuzione`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Analytics color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Predizioni Totali"
                      secondary={`${mockIntelligenceData.totalPredictions.toLocaleString()} analisi completate`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Miglioramento Accuratezza"
                      secondary={`+${mockIntelligenceData.accuracyImprovement}% rispetto all'anno scorso`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Speed color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Velocità Elaborazione"
                      secondary={`${mockIntelligenceData.processingSpeed} per predizione`}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Insights Avanzati
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Alert severity="info" icon={<Lightbulb />}>
                    <Typography variant="body2">
                      <strong>Trend Rilevato:</strong> Aumento del 18% nelle transazioni crypto.
                      Raccomandato monitoraggio intensivo per opportunità di investimento.
                    </Typography>
                  </Alert>
                  <Alert severity="warning" icon={<Warning />}>
                    <Typography variant="body2">
                      <strong>Rischio Identificato:</strong> Volatilità aumentata nel settore energetico.
                      Suggerito ribilanciamento portfolio per ridurre esposizione.
                    </Typography>
                  </Alert>
                  <Alert severity="success" icon={<CheckCircle />}>
                    <Typography variant="body2">
                      <strong>Opportunità:</strong> Settore healthcare mostra trend positivo stabile.
                      Considerare aumento allocazione per diversificazione.
                    </Typography>
                  </Alert>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Optimization Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Ottimizzazioni AI
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Portfolio Optimization"
                      secondary="Ribilanciamento automatico basato su ML e analisi di mercato"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Hub color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Risk Management"
                      secondary="Gestione dinamica del rischio con modelli predittivi"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoGraph color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Asset Allocation"
                      secondary="Distribuzione intelligente degli asset per massimizzare rendimenti"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Schedule color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Timing Optimization"
                      secondary="Timing ottimale per acquisti e vendite basato su AI"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        +{mockPredictiveData.portfolioOptimization}%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Rendimento Medio Portfolio Ottimizzato
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        -12.5%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Riduzione Volatilità Portfolio
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default AIAdvanced;

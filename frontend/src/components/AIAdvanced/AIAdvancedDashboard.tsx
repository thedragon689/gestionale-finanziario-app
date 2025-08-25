import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
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
  Hub
} from '@mui/icons-material';

// Services
import { aiPredictiveService, CashFlowPrediction, CreditRiskAnalysis, MarketTrendAnalysis, InterestRateInflationForecast } from '../../services/aiPredictiveService';
import { aiAutomationService, AutoApprovalResult, ComplianceCheck, IntelligentNotification } from '../../services/aiAutomationService';
import { aiChatbotService, ChatMessage, FinancialEducationContent } from '../../services/aiChatbotService';

interface AIAdvancedDashboardProps {
  open: boolean;
  onClose: () => void;
}

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
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AIAdvancedDashboard: React.FC<AIAdvancedDashboardProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Predictive Analytics States
  const [cashFlowPredictions, setCashFlowPredictions] = useState<CashFlowPrediction[]>([]);
  const [creditRiskAnalysis, setCreditRiskAnalysis] = useState<CreditRiskAnalysis[]>([]);
  const [marketTrends, setMarketTrends] = useState<MarketTrendAnalysis[]>([]);
  const [inflationForecasts, setInflationForecasts] = useState<InterestRateInflationForecast[]>([]);
  
  // Automation States
  const [pendingApprovals, setPendingApprovals] = useState<AutoApprovalResult[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [notifications, setNotifications] = useState<IntelligentNotification[]>([]);
  const [portfolioOptimizations, setPortfolioOptimizations] = useState<any[]>([]);
  
  // Chatbot States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [educationContent, setEducationContent] = useState<FinancialEducationContent[]>([]);
  
  // Dialog States
  const [showChatbot, setShowChatbot] = useState(false);
  const [showEducation, setShowEducation] = useState(false);

  // Dynamic data state
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45.2,
    memoryUsage: 67.8,
    networkLatency: 12.4,
    activeConnections: 1247,
    uptime: 99.97,
    responseTime: 89
  });

  const [aiModels, setAiModels] = useState({
    fraudDetection: { status: 'active', accuracy: 96.8, lastUpdate: '2 min fa' },
    portfolioOptimization: { status: 'active', accuracy: 94.2, lastUpdate: '5 min fa' },
    marketPrediction: { status: 'active', accuracy: 91.5, lastUpdate: '1 min fa' },
    complianceMonitoring: { status: 'active', accuracy: 98.1, lastUpdate: '3 min fa' }
  });

  const [operationalMetrics, setOperationalMetrics] = useState({
    transactionsProcessed: 15420,
    alertsGenerated: 89,
    complianceChecks: 1247,
    riskAssessments: 567
  });

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(50, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        networkLatency: Math.max(8, Math.min(20, prev.networkLatency + (Math.random() - 0.5) * 2)),
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 10) - 5
      }));

      setOperationalMetrics(prev => ({
        ...prev,
        transactionsProcessed: prev.transactionsProcessed + Math.floor(Math.random() * 50),
        alertsGenerated: prev.alertsGenerated + Math.floor(Math.random() * 3),
        complianceChecks: prev.complianceChecks + Math.floor(Math.random() * 20),
        riskAssessments: prev.riskAssessments + Math.floor(Math.random() * 10)
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (open) {
      loadAllData();
    }
  }, [open]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadPredictiveAnalytics(),
        loadAutomationData(),
        loadChatbotData()
      ]);
    } catch (error) {
      console.error('Error loading AI dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPredictiveAnalytics = async () => {
    try {
      const [cashFlow, creditRisk, market, inflation] = await Promise.all([
        aiPredictiveService.predictCashFlow('ACC_001', '3M'),
        Promise.all(['CUST_001', 'CUST_002', 'CUST_003'].map(id => 
          aiPredictiveService.analyzeCreditRisk(id)
        )),
        Promise.all(['FTSE MIB', 'Bitcoin', 'EUR/USD'].map(asset => 
          aiPredictiveService.analyzeMarketTrend(asset)
        )),
        aiPredictiveService.forecastInterestRateInflation('EU')
      ]);

      setCashFlowPredictions(cashFlow);
      setCreditRiskAnalysis(creditRisk);
      setMarketTrends(market);
      setInflationForecasts(inflation);
    } catch (error) {
      console.error('Error loading predictive analytics:', error);
    }
  };

  const loadAutomationData = async () => {
    try {
      const [compliance, notifs, portfolio] = await Promise.all([
        aiAutomationService.checkCompliance(),
        aiAutomationService.generateIntelligentNotifications('USER_001'),
        aiPredictiveService.optimizePortfolio('CUST_001', 'moderate')
      ]);

      setComplianceChecks(compliance);
      setNotifications(notifs);
      setPortfolioOptimizations([portfolio]);
    } catch (error) {
      console.error('Error loading automation data:', error);
    }
  };

  const loadChatbotData = async () => {
    try {
      const [investing, saving] = await Promise.all([
        aiChatbotService.getEducationalContent('investing', 'beginner'),
        aiChatbotService.getEducationalContent('saving', 'beginner')
      ]);

      setEducationContent([investing, saving]);
    } catch (error) {
      console.error('Error loading chatbot data:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
      case 'very_low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
      case 'very_high':
        return 'error';
      default:
        return 'info';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'success';
      case 'warning':
        return 'warning';
      case 'violation':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { height: '95vh', maxHeight: '95vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Psychology sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4" component="div">
              🤖 AI Advanced Financial Intelligence
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Aggiorna Dati">
              <IconButton onClick={loadAllData} disabled={isLoading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Impostazioni AI">
              <IconButton>
                <Settings />
              </IconButton>
            </Tooltip>
            <Button onClick={onClose} variant="outlined">
              Chiudi
            </Button>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp />
                  Analisi Predittiva
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security />
                  Frodi & Anomalie
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment />
                  Ottimizzazione
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoMode />
                  Automazione
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chat />
                  Chatbot AI
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Gavel />
                  Compliance
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOutline />
                  Personalizzazione
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chat />
                  Debug Chatbot
                </Box>
              } 
            />
          </Tabs>
        </Box>

        {/* System Performance Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Memory color="inherit" />
                  <Typography variant="h6">CPU Usage</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {systemMetrics.cpuUsage.toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={systemMetrics.cpuUsage} 
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.3)' }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Storage color="inherit" />
                  <Typography variant="h6">Memory</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {systemMetrics.memoryUsage.toFixed(1)}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={systemMetrics.memoryUsage} 
                  sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.3)' }}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Speed color="inherit" />
                  <Typography variant="h6">Response Time</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {systemMetrics.responseTime}ms
                </Typography>
                <Typography variant="body2">
                  Uptime: {systemMetrics.uptime}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Hub color="inherit" />
                  <Typography variant="h6">Connections</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold">
                  {systemMetrics.activeConnections.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Latency: {systemMetrics.networkLatency}ms
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI Models Status */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🤖 AI Models Status
                </Typography>
                {Object.entries(aiModels).map(([model, data]) => (
                  <Box key={model} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                        {model.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {data.lastUpdate}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip 
                        label={data.status} 
                        size="small" 
                        color={data.status === 'active' ? 'success' : 'error'}
                      />
                      <Typography variant="body2" color="success.main">
                        {data.accuracy}% accuracy
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Operational Metrics
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Transactions Processed:</Typography>
                  <Typography fontWeight="bold">{operationalMetrics.transactionsProcessed.toLocaleString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Alerts Generated:</Typography>
                  <Typography fontWeight="bold" color="warning.main">
                    {operationalMetrics.alertsGenerated}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Compliance Checks:</Typography>
                  <Typography fontWeight="bold" color="info.main">
                    {operationalMetrics.complianceChecks.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography>Risk Assessments:</Typography>
                  <Typography fontWeight="bold" color="error.main">
                    {operationalMetrics.riskAssessments}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tab Panel Analisi Predittiva */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            {/* Cash Flow Predictions */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="📈 Previsione Flussi di Cassa"
                  action={
                    <Chip label={`${cashFlowPredictions.length} previsioni`} color="primary" />
                  }
                />
                <CardContent>
                  {cashFlowPredictions.slice(0, 3).map((prediction, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h6">{prediction.period}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography color="success.main">
                          Entrate: {formatCurrency(prediction.predictedInflow)}
                        </Typography>
                        <Typography color="error.main">
                          Uscite: {formatCurrency(prediction.predictedOutflow)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Netto: {formatCurrency(prediction.netCashFlow)}</strong>
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={`${(prediction.confidence * 100).toFixed(0)}% confidenza`} 
                          size="small" 
                          color="info"
                        />
                        <Chip 
                          label={`Rischio: ${prediction.risk}`} 
                          size="small" 
                          color={getRiskColor(prediction.risk)}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Credit Risk Analysis */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="🎯 Analisi Rischio Credito"
                  action={
                    <Chip label={`${creditRiskAnalysis.length} clienti`} color="warning" />
                  }
                />
                <CardContent>
                  {creditRiskAnalysis.slice(0, 3).map((analysis, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h6">{analysis.customerName}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Typography>Score: <strong>{analysis.creditScore}</strong></Typography>
                        <Chip 
                          label={analysis.riskLevel} 
                          size="small" 
                          color={getRiskColor(analysis.riskLevel)}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Probabilità default: <strong>{(analysis.probabilityDefault * 100).toFixed(1)}%</strong>
                      </Typography>
                      <Typography variant="body2">
                        Limite consigliato: <strong>{formatCurrency(analysis.maxCreditLimit)}</strong>
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Market Trends */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="📊 Trend di Mercato"
                  action={
                    <Chip label={`${marketTrends.length} asset`} color="secondary" />
                  }
                />
                <CardContent>
                  {marketTrends.map((trend, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h6">{trend.asset}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography>Prezzo: <strong>{formatCurrency(trend.currentPrice)}</strong></Typography>
                        <Chip 
                          label={trend.trendDirection} 
                          size="small" 
                          color={trend.trendDirection === 'bullish' ? 'success' : trend.trendDirection === 'bearish' ? 'error' : 'warning'}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Previsione 1M: <strong>{formatCurrency(trend.predictedPrice.mediumTerm)}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Volatilità: <strong>{(trend.volatility * 100).toFixed(1)}%</strong>
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Interest Rate & Inflation Forecast */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="💹 Previsioni Tassi & Inflazione"
                  action={
                    <Chip label="Zona Euro" color="info" />
                  }
                />
                <CardContent>
                  {inflationForecasts.slice(0, 2).map((forecast, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h6">{forecast.period}</Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Tassi: <strong>{forecast.interestRate.predicted.toFixed(2)}%</strong>
                          </Typography>
                          <Chip 
                            label={forecast.interestRate.direction} 
                            size="small" 
                            color={forecast.interestRate.direction === 'rising' ? 'error' : 'success'}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Inflazione: <strong>{forecast.inflation.predicted.toFixed(2)}%</strong>
                          </Typography>
                          <Chip 
                            label={forecast.inflation.direction} 
                            size="small" 
                            color={forecast.inflation.direction === 'rising' ? 'warning' : 'success'}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel Frodi & Anomalie */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="h6">🔍 Sistema di Rilevamento Frodi Attivo</Typography>
                <Typography>Monitoraggio in tempo reale di transazioni sospette e analisi comportamentale avanzata.</Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="🚨 Alert Frodi Recenti" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon><Warning color="error" /></ListItemIcon>
                      <ListItemText 
                        primary="Transazione sospetta"
                        secondary="Cliente #123 - €5.000 - Singapore"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Warning color="warning" /></ListItemIcon>
                      <ListItemText 
                        primary="Pattern anomalo"
                        secondary="Cliente #456 - Orario inusuale"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="📊 Statistiche Sicurezza" />
                <CardContent>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="success.main">99.2%</Typography>
                    <Typography>Accuratezza Rilevamento</Typography>
                  </Box>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="error.main">0.01%</Typography>
                    <Typography>Falsi Positivi</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="🛡️ Azioni Preventive" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Verifica KYC automatica" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText primary="Blacklist aggiornata" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Schedule color="warning" /></ListItemIcon>
                      <ListItemText primary="Training modello ML" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel Ottimizzazione */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {portfolioOptimizations.map((optimization, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardHeader 
                    title={`💼 Ottimizzazione Portfolio - Cliente ${optimization.customerId}`}
                    action={
                      <Chip 
                        label={optimization.riskProfile} 
                        color="primary" 
                      />
                    }
                  />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Portfolio Attuale</Typography>
                        {optimization.currentPortfolio.map((asset: any, i: number) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>{asset.asset}</Typography>
                            <Box>
                              <Typography variant="body2">
                                {asset.allocation}% - {formatCurrency(asset.currentValue)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Portfolio Ottimizzato</Typography>
                        {optimization.optimizedPortfolio.map((asset: any, i: number) => (
                          <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography>{asset.asset}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">{asset.targetAllocation}%</Typography>
                              <Chip 
                                label={asset.suggestedAction} 
                                size="small" 
                                color={asset.suggestedAction === 'buy' ? 'success' : asset.suggestedAction === 'sell' ? 'error' : 'default'}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="h6" color="primary.contrastText">
                        Rendimento Atteso: {optimization.expectedReturn}%
                      </Typography>
                      <Typography variant="body2" color="primary.contrastText">
                        Sharpe Ratio: {optimization.riskMetrics.sharpeRatio.toFixed(2)} | 
                        Volatilità: {(optimization.riskMetrics.volatility * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab Panel Automazione */}
        <TabPanel value={activeTab} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="⚡ Notifiche Intelligenti" />
                <CardContent>
                  {notifications.map((notification, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Lightbulb color="primary" />
                        <Typography variant="h6">{notification.title}</Typography>
                        <Chip 
                          label={notification.priority} 
                          size="small" 
                          color={notification.priority === 'critical' ? 'error' : notification.priority === 'high' ? 'warning' : 'info'}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {notification.actions.map((action, i) => (
                          <Button 
                            key={i}
                            size="small" 
                            variant={action.primary ? 'contained' : 'outlined'}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="📋 Report Automatici" />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                      <ListItemText 
                        primary="Report Mensile" 
                        secondary="Generato automaticamente - Marzo 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Schedule color="warning" /></ListItemIcon>
                      <ListItemText 
                        primary="Report Trimestrale" 
                        secondary="In generazione - Q1 2024"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Schedule color="info" /></ListItemIcon>
                      <ListItemText 
                        primary="Report BCE" 
                        secondary="Programmato - 15 Aprile 2024"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel Chatbot */}
        <TabPanel value={activeTab} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: 400 }}>
                <CardHeader 
                  title="💬 FinBot - Assistente AI"
                  action={
                    <Button variant="contained" onClick={() => setShowChatbot(true)}>
                      Apri Chat
                    </Button>
                  }
                />
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Il nostro chatbot AI fornisce assistenza 24/7 per:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><Chat /></ListItemIcon>
                      <ListItemText primary="Controllo saldi e movimenti" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><TrendingUp /></ListItemIcon>
                      <ListItemText primary="Consigli di investimento personalizzati" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Assessment /></ListItemIcon>
                      <ListItemText primary="Analisi di mercato in tempo reale" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Security /></ListItemIcon>
                      <ListItemText primary="Educazione finanziaria interattiva" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="📚 Educazione Finanziaria" />
                <CardContent>
                  {educationContent.map((content, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="h6">{content.title}</Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {content.content.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip label={content.level} size="small" />
                        <Chip label={`${content.duration} min`} size="small" color="info" />
                      </Box>
                    </Box>
                  ))}
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => setShowEducation(true)}
                  >
                    Vedi Tutti i Corsi
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel Compliance */}
        <TabPanel value={activeTab} index={5}>
          <Grid container spacing={3}>
            {complianceChecks.map((check, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardHeader 
                    title={check.regulation}
                    action={
                      <Chip 
                        label={check.status} 
                        color={getComplianceColor(check.status)}
                      />
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {check.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Verifiche:
                    </Typography>
                    
                    {check.findings.map((finding, i) => (
                      <Box key={i} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2">
                          <strong>{finding.type}:</strong> {finding.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {finding.recommendation}
                        </Typography>
                      </Box>
                    ))}
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Ultimo controllo: {new Date(check.lastChecked).toLocaleDateString('it-IT')}
                      </Typography>
                      {check.autoRemediationAvailable && (
                        <Button size="small" variant="contained" color="primary">
                          Auto-Fix
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab Panel Personalizzazione */}
        <TabPanel value={activeTab} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info">
                <Typography variant="h6">🎯 Dashboard Personalizzati</Typography>
                <Typography>L'AI analizza il comportamento degli utenti per creare esperienze personalizzate.</Typography>
              </Alert>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="👤 Profili Utente" />
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Widget adattivi basati su ruolo e preferenze
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Manager"
                        secondary="Focus su KPI e compliance"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Operatore"
                        secondary="Workflow e approvazioni"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Cliente"
                        secondary="Portfolio e transazioni"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="🎯 Offerte Mirate" />
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Profilazione automatica per raccomandazioni personalizzate
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Cliente Premium</Typography>
                    <Typography variant="body2">Conto Premium Plus - 85% match</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Giovane Investitore</Typography>
                    <Typography variant="body2">ETF Starter Pack - 92% match</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title="📊 Analisi Comportamentale" />
                <CardContent>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Pattern di utilizzo e preferenze
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption">Sessioni medie</Typography>
                    <Typography variant="h6">15 min</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption">Moduli più usati</Typography>
                    <Typography variant="body2">Dashboard, Investimenti</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption">Orario preferito</Typography>
                    <Typography variant="body2">09:00 - 11:00</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab Panel Debug Chatbot */}
        <TabPanel value={activeTab} index={7}>
          <Alert severity="info">
            <Typography variant="h6">🐛 Debug Chatbot</Typography>
            <Typography>Questa sezione è stata rimossa poiché il componente ChatbotSimpleTest è stato eliminato.</Typography>
          </Alert>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

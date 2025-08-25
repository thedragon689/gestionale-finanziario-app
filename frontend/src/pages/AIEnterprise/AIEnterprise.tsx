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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Security,
  Analytics,
  AutoGraph,
  SmartToy,
  Insights,
  Warning,
  CheckCircle,
  Error,
  Refresh,
  PlayArrow,
  Stop,
  Settings,
  Download,
  Share,
} from '@mui/icons-material';

interface AIAnalysis {
  id: string;
  type: 'risk' | 'opportunity' | 'anomaly' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'failed';
  timestamp: Date;
  recommendations: string[];
}

interface AIModel {
  id: string;
  name: string;
  type: 'risk-assessment' | 'fraud-detection' | 'market-prediction' | 'customer-segmentation';
  accuracy: number;
  status: 'active' | 'training' | 'maintenance';
  lastUpdated: Date;
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

const AIEnterprise: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const mockAIAnalyses: AIAnalysis[] = [
    {
      id: '1',
      type: 'risk',
      title: 'Rischio di Credito Elevato - Cliente XYZ',
      description: 'Il sistema AI ha rilevato un pattern di comportamento che suggerisce un aumento del rischio di credito per il cliente XYZ.',
      confidence: 87.5,
      impact: 'high',
      status: 'active',
      timestamp: new Date('2024-01-15T14:30:00'),
      recommendations: [
        'Rivedere i limiti di credito',
        'Implementare monitoraggio più frequente',
        'Richiedere garanzie aggiuntive'
      ]
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Opportunità di Investimento - Settore Tech',
      description: 'Analisi predittiva indica una crescita del 15% nel settore tecnologico nei prossimi 6 mesi.',
      confidence: 92.3,
      impact: 'high',
      status: 'active',
      timestamp: new Date('2024-01-15T12:15:00'),
      recommendations: [
        'Aumentare esposizione al settore tech',
        'Valutare nuove partnership',
        'Ridurre esposizione ai settori in declino'
      ]
    },
    {
      id: '3',
      type: 'anomaly',
      title: 'Transazione Anomala Rilevata',
      description: 'Rilevata transazione sospetta di €50,000 che devia dal pattern normale del cliente.',
      confidence: 94.1,
      impact: 'medium',
      status: 'active',
      timestamp: new Date('2024-01-15T10:45:00'),
      recommendations: [
        'Verificare con il cliente',
        'Implementare controlli aggiuntivi',
        'Monitorare attività correlate'
      ]
    },
    {
      id: '4',
      type: 'prediction',
      title: 'Previsione Flussi di Cassa - Q2 2024',
      description: 'Modello predittivo indica un aumento del 8.5% nei flussi di cassa per il secondo trimestre.',
      confidence: 89.7,
      impact: 'medium',
      status: 'completed',
      timestamp: new Date('2024-01-14T16:20:00'),
      recommendations: [
        'Preparare strategie di investimento',
        'Valutare opportunità di espansione',
        'Ottimizzare gestione liquidità'
      ]
    }
  ];

  const mockAIModels: AIModel[] = [
    {
      id: '1',
      name: 'Risk Assessment Model v2.1',
      type: 'risk-assessment',
      accuracy: 94.2,
      status: 'active',
      lastUpdated: new Date('2024-01-10T09:00:00'),
      performance: {
        precision: 0.92,
        recall: 0.89,
        f1Score: 0.90
      }
    },
    {
      id: '2',
      name: 'Fraud Detection AI',
      type: 'fraud-detection',
      accuracy: 97.8,
      status: 'active',
      lastUpdated: new Date('2024-01-12T14:30:00'),
      performance: {
        precision: 0.96,
        recall: 0.94,
        f1Score: 0.95
      }
    },
    {
      id: '3',
      name: 'Market Prediction Engine',
      type: 'market-prediction',
      accuracy: 88.5,
      status: 'training',
      lastUpdated: new Date('2024-01-15T08:00:00'),
      performance: {
        precision: 0.85,
        recall: 0.87,
        f1Score: 0.86
      }
    },
    {
      id: '4',
      name: 'Customer Segmentation AI',
      type: 'customer-segmentation',
      accuracy: 91.3,
      status: 'maintenance',
      lastUpdated: new Date('2024-01-08T11:15:00'),
      performance: {
        precision: 0.89,
        recall: 0.92,
        f1Score: 0.90
      }
    }
  ];

  const getAnalysisIcon = (type: AIAnalysis['type']) => {
    switch (type) {
      case 'risk':
        return <Warning color="error" />;
      case 'opportunity':
        return <TrendingUp color="success" />;
      case 'anomaly':
        return <Security color="warning" />;
      case 'prediction':
        return <AutoGraph color="info" />;
      default:
        return <Insights />;
    }
  };

  const getImpactColor = (impact: AIAnalysis['impact']) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: AIAnalysis['status']) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getModelStatusColor = (status: AIModel['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'training':
        return 'warning';
      case 'maintenance':
        return 'info';
      default:
        return 'default';
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const filteredAnalyses = selectedAnalysis === 'all' 
    ? mockAIAnalyses 
    : mockAIAnalyses.filter(analysis => analysis.type === selectedAnalysis);

  const filteredModels = selectedModel === 'all'
    ? mockAIModels
    : mockAIModels.filter(model => model.type === selectedModel);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          AI Enterprise - Intelligenza Artificiale Avanzata
        </Typography>

        {/* AI Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Psychology color="primary" />
                  <Typography color="textSecondary">Modelli AI Attivi</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {mockAIModels.filter(m => m.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  di {mockAIModels.length} totali
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Insights color="success" />
                  <Typography color="textSecondary">Analisi Attive</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {mockAIAnalyses.filter(a => a.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Monitoraggio in tempo reale
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="info" />
                  <Typography color="textSecondary">Precisione Media</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {Math.round(mockAIModels.reduce((sum, m) => sum + m.accuracy, 0) / mockAIModels.length)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Accuratezza modelli
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Security color="warning" />
                  <Typography color="textSecondary">Rischi Identificati</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {mockAIAnalyses.filter(a => a.type === 'risk' && a.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Richiedono attenzione
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI Analysis Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo Analisi</InputLabel>
                <Select
                  value={selectedAnalysis}
                  label="Tipo Analisi"
                  onChange={(e) => setSelectedAnalysis(e.target.value)}
                >
                  <MenuItem value="all">Tutte le Analisi</MenuItem>
                  <MenuItem value="risk">Rischi</MenuItem>
                  <MenuItem value="opportunity">Opportunità</MenuItem>
                  <MenuItem value="anomaly">Anomalie</MenuItem>
                  <MenuItem value="prediction">Previsioni</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Modello AI</InputLabel>
                <Select
                  value={selectedModel}
                  label="Modello AI"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  <MenuItem value="all">Tutti i Modelli</MenuItem>
                  <MenuItem value="risk-assessment">Valutazione Rischio</MenuItem>
                  <MenuItem value="fraud-detection">Rilevamento Frodi</MenuItem>
                  <MenuItem value="market-prediction">Previsione Mercato</MenuItem>
                  <MenuItem value="customer-segmentation">Segmentazione Clienti</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={isAnalyzing ? <Stop /> : <PlayArrow />}
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  sx={{ flex: 1 }}
                >
                  {isAnalyzing ? 'Ferma Analisi' : 'Avvia Nuova Analisi'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                >
                  Aggiorna
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                >
                  Esporta
                </Button>
              </Box>
            </Grid>
          </Grid>

          {isAnalyzing && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Analisi in corso... {analysisProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={analysisProgress} />
            </Box>
          )}
        </Paper>

        {/* AI Analysis Results */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Analisi AI in Tempo Reale
              </Typography>
              <List>
                {filteredAnalyses.map((analysis) => (
                  <React.Fragment key={analysis.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        {getAnalysisIcon(analysis.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body1" fontWeight="medium">
                              {analysis.title}
                            </Typography>
                            <Chip
                              label={analysis.impact}
                              size="small"
                              color={getImpactColor(analysis.impact) as any}
                              variant="outlined"
                            />
                            <Chip
                              label={analysis.status}
                              size="small"
                              color={getStatusColor(analysis.status) as any}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary" paragraph>
                              {analysis.description}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Confidenza: <strong>{analysis.confidence}%</strong> | 
                              Timestamp: {analysis.timestamp.toLocaleString()}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" fontWeight="medium" gutterBottom>
                                Raccomandazioni:
                              </Typography>
                              {analysis.recommendations.map((rec, index) => (
                                <Typography key={index} variant="body2" color="textSecondary">
                                  • {rec}
                                </Typography>
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Modelli AI
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredModels.map((model) => (
                  <Card key={model.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {model.name}
                        </Typography>
                        <Chip
                          label={model.status}
                          size="small"
                          color={getModelStatusColor(model.status) as any}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Tipo: {model.type.replace('-', ' ')}
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {model.accuracy}%
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Accuratezza
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                          Precision: {model.performance.precision} | 
                          Recall: {model.performance.recall} | 
                          F1: {model.performance.f1Score}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Ultimo aggiornamento: {model.lastUpdated.toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* AI Insights */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Insights AI
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Alert severity="info" icon={<Insights />}>
                <Typography variant="body2">
                  <strong>Trend Rilevato:</strong> Aumento del 12% nelle transazioni crypto nel mese corrente.
                  Il modello suggerisce di monitorare questo trend per opportunità di investimento.
                </Typography>
              </Alert>
            </Grid>
            <Grid item xs={12} md={6}>
              <Alert severity="warning" icon={<Warning />}>
                <Typography variant="body2">
                  <strong>Anomalia Rilevata:</strong> Pattern di transazioni insolite per 3 clienti business.
                  Raccomandato controllo manuale entro 24 ore.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default AIEnterprise;

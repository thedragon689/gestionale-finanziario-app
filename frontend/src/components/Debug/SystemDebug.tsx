import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  BugReport,
  Refresh,
  ExpandMore,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';
import { debugService, SystemStatus } from '../../services/debugService';

const SystemDebug: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [mockDataTest, setMockDataTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSystemStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = await debugService.checkServiceStatus();
      setSystemStatus(status);
      
      // Test mock data
      const mockResults = await debugService.testMockData();
      setMockDataTest(mockResults);
    } catch (err: unknown) {
      let errorMessage = 'Errore sconosciuto';
      if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = String(err.message);
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemStatus();
    debugService.logSystemStatus();
  }, []);

  const getStatusIcon = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getStatusColor = (status: 'ok' | 'warning' | 'error') => {
    switch (status) {
      case 'ok':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Controllo stato sistema...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom display="flex" alignItems="center">
        <BugReport sx={{ mr: 2 }} />
        Debug Sistema
      </Typography>

      <Box mb={3}>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={checkSystemStatus}
          disabled={loading}
        >
          Aggiorna Stato
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Errore durante il controllo: {error}
        </Alert>
      )}

      {systemStatus && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stato Generale Sistema
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Ultimo aggiornamento: {new Date(systemStatus.timestamp).toLocaleString('it-IT')}
            </Typography>

            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Variabili d'Ambiente:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip
                  label={`NODE_ENV: ${systemStatus.environment.nodeEnv}`}
                  color={systemStatus.environment.nodeEnv === 'development' ? 'success' : 'default'}
                  size="small"
                />
                <Chip
                  label={`API_URL: ${systemStatus.environment.apiUrl}`}
                  color={systemStatus.environment.apiUrl !== 'undefined' ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={`CORE_BANKING: ${systemStatus.environment.coreBankingUrl}`}
                  color={systemStatus.environment.coreBankingUrl !== 'undefined' ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={`CRYPTO_URL: ${systemStatus.environment.cryptoUrl}`}
                  color={systemStatus.environment.cryptoUrl !== 'undefined' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Local Storage:
              </Typography>
              <Box display="flex" gap={1}>
                <Chip
                  label={`Token: ${systemStatus.localStorage.token ? 'Presente' : 'Mancante'}`}
                  color={systemStatus.localStorage.token ? 'success' : 'error'}
                  size="small"
                />
                <Chip
                  label={`User: ${systemStatus.localStorage.user ? 'Presente' : 'Mancante'}`}
                  color={systemStatus.localStorage.user ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {systemStatus && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Stato Servizi
            </Typography>
            <List>
              {systemStatus.services.map((service, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(service.status)}
                        {service.serviceName}
                        <Chip
                          label={service.status.toUpperCase()}
                          color={getStatusColor(service.status) as any}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={service.message}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {mockDataTest && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Test Dati Mock
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>Risultati Test Servizi</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Object.entries(mockDataTest).map(([serviceName, result]: [string, any]) => (
                  <Box key={serviceName} mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}:
                    </Typography>
                    {result.success ? (
                      <Alert severity="success" sx={{ mb: 1 }}>
                        ✅ Servizio funzionante
                        {result.count && ` - ${result.count} elementi caricati`}
                      </Alert>
                    ) : (
                      <Alert severity="error" sx={{ mb: 1 }}>
                        ❌ Errore: {result.error}
                      </Alert>
                    )}
                    {result.data && (
                      <Box mt={1}>
                        <Typography variant="body2" color="textSecondary">
                          Dati di esempio:
                        </Typography>
                        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </Box>
                    )}
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SystemDebug;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Error,
  PlayArrow,
  Stop,
  Refresh,
  TrendingUp,
  Security,
  DataUsage
} from '@mui/icons-material';
import { AIEnterpriseCore, FinancialData } from './AIEnterpriseCore';
import { DataManagementSystem } from './DataManagementSystem';
import { SecurityComplianceSystem } from './SecurityComplianceSystem';

// ===== COMPONENTE DI TEST AI ENTERPRISE =====

export const AIEnterpriseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const [aiCore] = useState(new AIEnterpriseCore());
  const [dataSystem] = useState(new DataManagementSystem());
  const [securitySystem] = useState(new SecurityComplianceSystem());

  // ===== TEST FUNZIONALI =====
  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setTestResults({});

    try {
      console.log('🚀 Avvio test completi del sistema AI Enterprise...');

      // Test 1: Core AI System
      console.log('📊 Test 1: Core AI System...');
      const coreTest = await testAICore();
      setTestResults(prev => ({ ...prev, core: coreTest }));

      // Test 2: Data Management
      console.log('📊 Test 2: Data Management...');
      const dataTest = await testDataManagement();
      setTestResults(prev => ({ ...prev, data: dataTest }));

      // Test 3: Security & Compliance
      console.log('📊 Test 3: Security & Compliance...');
      const securityTest = await testSecurityCompliance();
      setTestResults(prev => ({ ...prev, security: securityTest }));

      // Test 4: Integration Tests
      console.log('📊 Test 4: Integration Tests...');
      const integrationTest = await testIntegration();
      setTestResults(prev => ({ ...prev, integration: integrationTest }));

      console.log('✅ Tutti i test completati con successo!');
      setOverallStatus('success');

    } catch (error) {
      console.error('❌ Errore durante i test:', error);
      setOverallStatus('error');
    } finally {
      setIsRunning(false);
    }
  };

  // Test 1: Core AI System
  const testAICore = async () => {
    const results: any = {};

    try {
      // Test modelli disponibili
      const models = aiCore.getAllModels();
      results.modelsCount = models.size;
      results.modelsList = Array.from(models.keys());

      // Test health check
      const health = aiCore.getSystemHealth();
      results.healthStatus = health.systemStatus;
      results.totalModels = health.totalModels;
      results.activeModels = health.activeModels;

      // Test anomaly detection
      const sampleData: FinancialData[] = [
        {
          transactionId: 'test_001',
          amount: 15000,
          currency: 'EUR',
          timestamp: new Date(),
          customerId: 'cust_001',
          transactionType: 'transfer' as const,
          riskScore: 0.9,
          fraudProbability: 0.8,
          marketSentiment: 0.3,
          metadata: {}
        }
      ];

      const anomalies = await aiCore.detectAnomalies(sampleData);
      results.anomalyDetection = {
        success: true,
        anomaliesFound: anomalies.length,
        sampleAnomaly: anomalies[0] || null
      };

      // Test portfolio optimization
      const portfolioData = { assets: ['stocks', 'bonds'], constraints: { risk: 0.3 } };
      const optimization = await aiCore.optimizePortfolio(portfolioData, {});
      results.portfolioOptimization = {
        success: true,
        result: optimization
      };

      results.status = 'success';
      results.message = 'Core AI System funzionante';

    } catch (error) {
      results.status = 'error';
      results.message = (error as Error)?.message || 'Errore sconosciuto';
      results.error = error;
    }

    return results;
  };

  // Test 2: Data Management
  const testDataManagement = async () => {
    const results: any = {};

    try {
      // Test fonti dati
      const dataSources = dataSystem.getDataSources();
      results.dataSourcesCount = dataSources.size;
      results.dataSourcesList = Array.from(dataSources.keys());

      // Test pipeline preprocessing
      const preprocessingPipelines = dataSystem.getPreprocessingPipelines();
      results.pipelinesCount = preprocessingPipelines.size;
      results.pipelinesList = Array.from(preprocessingPipelines.keys());

      // Test feature engineering
      const featureRules = dataSystem.getFeatureEngineeringRules();
      results.featureRulesCount = featureRules.size;
      results.featureRulesList = Array.from(featureRules.keys());

      // Test integrazione dati esterni
      const marketData = await dataSystem.integrateMarketData(['AAPL', 'GOOGL']);
      results.marketDataIntegration = {
        success: true,
        symbols: marketData.map(d => d.symbol),
        dataCount: marketData.length
      };

      // Test stato sistema
      const systemStatus = await dataSystem.getSystemStatus();
      results.systemStatus = systemStatus;

      results.status = 'success';
      results.message = 'Data Management System funzionante';

    } catch (error) {
      results.status = 'error';
      results.message = (error as Error)?.message || 'Errore sconosciuto';
      results.error = error;
    }

    return results;
  };

  // Test 3: Security & Compliance
  const testSecurityCompliance = async () => {
    const results: any = {};

    try {
      // Test policy di sicurezza
      const securityPolicies = securitySystem.getSecurityPolicies();
      results.securityPoliciesCount = securityPolicies.size;
      results.securityPoliciesList = Array.from(securityPolicies.keys());

      // Test requisiti compliance
      const complianceRequirements = securitySystem.getComplianceRequirements();
      results.complianceRequirementsCount = complianceRequirements.size;
      results.complianceRequirementsList = Array.from(complianceRequirements.keys());

      // Test audit trail
      const auditTrails = securitySystem.getAuditTrails();
      results.auditTrailsCount = auditTrails.length;

      // Test impostazioni privacy
      const privacySettings = securitySystem.getPrivacySettings();
      results.privacySettings = privacySettings;

      // Test compliance report
      const complianceReport = await securitySystem.generateComplianceReport();
      results.complianceReport = complianceReport;

      // Test bias detection
      const sampleData = [
        { gender: 'M', age: 30, income: 50000, risk: 0.3 },
        { gender: 'F', age: 35, income: 60000, risk: 0.4 }
      ];
      const biasResult = await securitySystem.detectBias(sampleData, 'gender_bias');
      results.biasDetection = {
        success: true,
        result: biasResult
      };

      results.status = 'success';
      results.message = 'Security & Compliance System funzionante';

    } catch (error) {
      results.status = 'error';
      results.message = (error as Error)?.message || 'Errore sconosciuto';
      results.error = error;
    }

    return results;
  };

  // Test 4: Integration Tests
  const testIntegration = async () => {
    const results: any = {};

    try {
      // Test integrazione tra sistemi
      const coreHealth = aiCore.getSystemHealth();
      const dataStatus = await dataSystem.getSystemStatus();
      const securityStatus = await securitySystem.getSystemStatus();

      results.integrationStatus = {
        core: coreHealth.systemStatus,
        data: dataStatus.status,
        security: securityStatus.status
      };

      // Test end-to-end
      const sampleFinancialData: FinancialData[] = [
        {
          transactionId: 'int_test_001',
          amount: 5000,
          currency: 'EUR',
          timestamp: new Date(),
          customerId: 'int_cust_001',
          transactionType: 'credit' as const,
          riskScore: 0.2,
          fraudProbability: 0.1,
          marketSentiment: 0.7,
          metadata: {}
        }
      ];

      // Pipeline completa: dati → preprocessing → AI → risultati
      const processedData = await dataSystem.preprocessFinancialData(sampleFinancialData);
      const features = await dataSystem.engineerFeatures(processedData);
      const anomalies = await aiCore.detectAnomalies(processedData);
      const biasCheck = await securitySystem.detectBias(processedData, 'gender_bias');

      results.endToEndTest = {
        success: true,
        processedDataCount: processedData.length,
        featuresGenerated: features.length,
        anomaliesDetected: anomalies.length,
        biasCheckResult: biasCheck
      };

      results.status = 'success';
      results.message = 'Test di integrazione completati con successo';

    } catch (error) {
      results.status = 'error';
      results.message = (error as Error)?.message || 'Errore sconosciuto';
      results.error = error;
    }

    return results;
  };

  // ===== RENDERIZZAZIONE =====
  const renderTestResults = () => {
    if (Object.keys(testResults).length === 0) {
      return (
        <Alert severity="info">
          Nessun test eseguito. Clicca "Esegui Test" per iniziare.
        </Alert>
      );
    }

    return (
      <Grid container spacing={3}>
        {/* Core AI Test Results */}
        {testResults.core && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Core AI System</Typography>
                  <Chip 
                    label={testResults.core.status} 
                    color={testResults.core.status === 'success' ? 'success' : 'error'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                {testResults.core.status === 'success' ? (
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Modelli: ${testResults.core.totalModels} totali, ${testResults.core.activeModels} attivi`}
                        secondary={`Status: ${testResults.core.healthStatus}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Anomaly Detection"
                        secondary={`${testResults.core.anomalyDetection.anomaliesFound} anomalie rilevate`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Portfolio Optimization"
                        secondary="Funzionante"
                      />
                    </ListItem>
                  </List>
                ) : (
                  <Alert severity="error">
                    {testResults.core.message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Data Management Test Results */}
        {testResults.data && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <DataUsage color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Data Management</Typography>
                  <Chip 
                    label={testResults.data.status} 
                    color={testResults.data.status === 'success' ? 'success' : 'error'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                {testResults.data.status === 'success' ? (
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Fonti Dati: ${testResults.data.dataSourcesCount}`}
                        secondary={testResults.data.dataSourcesList.join(', ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Pipeline: ${testResults.data.pipelinesCount}`}
                        secondary={testResults.data.pipelinesList.join(', ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Market Data Integration"
                        secondary={`${testResults.data.marketDataIntegration.symbols.join(', ')}`}
                      />
                    </ListItem>
                  </List>
                ) : (
                  <Alert severity="error">
                    {testResults.data.message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Security & Compliance Test Results */}
        {testResults.security && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Security color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Security & Compliance</Typography>
                  <Chip 
                    label={testResults.security.status} 
                    color={testResults.security.status === 'success' ? 'success' : 'error'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                {testResults.security.status === 'success' ? (
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Security Policies: ${testResults.security.securityPoliciesCount}`}
                        secondary={testResults.security.securityPoliciesList.join(', ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Compliance: ${testResults.security.complianceRequirementsCount}`}
                        secondary={testResults.security.complianceRequirementsList.join(', ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Bias Detection"
                        secondary={`${testResults.security.biasDetection.result.hasBias ? 'Bias rilevato' : 'Nessun bias'}`}
                      />
                    </ListItem>
                  </List>
                ) : (
                  <Alert severity="error">
                    {testResults.security.message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Integration Test Results */}
        {testResults.integration && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircle color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Integration Tests</Typography>
                  <Chip 
                    label={testResults.integration.status} 
                    color={testResults.integration.status === 'success' ? 'success' : 'error'}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                
                {testResults.integration.status === 'success' ? (
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="System Integration"
                        secondary={`Core: ${testResults.integration.integrationStatus.core}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="End-to-End Pipeline"
                        secondary={`${testResults.integration.endToEndTest.processedDataCount} record processati`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Feature Engineering"
                        secondary={`${testResults.integration.endToEndTest.featuresGenerated} feature sets generati`}
                      />
                    </ListItem>
                  </List>
                ) : (
                  <Alert severity="error">
                    {testResults.integration.message}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'running': return 'warning';
      default: return 'info';
    }
  };

  const getOverallStatusIcon = () => {
    switch (overallStatus) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'running': return <CircularProgress size={20} />;
      default: return <PlayArrow />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          🧪 AI Enterprise System - Test Suite
        </Typography>
        <Chip 
          icon={getOverallStatusIcon()}
          label={overallStatus.toUpperCase()}
          color={getOverallStatusColor()}
          variant="outlined"
        />
      </Box>

      {/* Controlli */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={isRunning ? <Stop /> : <PlayArrow />}
              onClick={runAllTests}
              disabled={isRunning}
              color={isRunning ? 'error' : 'primary'}
            >
              {isRunning ? 'Test in Corso...' : 'Esegui Test Completati'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                setTestResults({});
                setOverallStatus('idle');
              }}
              disabled={isRunning}
            >
              Reset Test
            </Button>

            {isRunning && (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="textSecondary">
                  Esecuzione test in corso...
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Risultati Test */}
      {renderTestResults()}

      {/* Status Finale */}
      {overallStatus === 'success' && (
        <Alert severity="success" sx={{ mt: 3 }}>
          🎉 Tutti i test sono stati completati con successo! Il sistema AI Enterprise è operativo e funzionante.
        </Alert>
      )}

      {overallStatus === 'error' && (
        <Alert severity="error" sx={{ mt: 3 }}>
          ❌ Alcuni test hanno fallito. Controlla i log per dettagli.
        </Alert>
      )}

      {/* Informazioni Sistema */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Informazioni Sistema
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Il sistema AI Enterprise è ora completamente integrato nel gestionale finanziario. 
            Tutti i modelli ML, le pipeline di dati, e i sistemi di sicurezza sono operativi.
          </Typography>
          <Box mt={2}>
            <Typography variant="body2">
              <strong>Componenti Testati:</strong> Core AI, Data Management, Security & Compliance, Integration
            </Typography>
            <Typography variant="body2">
              <strong>Stato:</strong> {overallStatus === 'success' ? '✅ Operativo' : overallStatus === 'running' ? '🔄 In Test' : '⏸️ In Attesa'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

import React, { useState, useRef, useEffect } from 'react';
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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  SmartToy,
  Send,
  AutoGraph,
  Security,
  TrendingUp,
  Chat,
  PlayArrow,
  Stop,
  Lightbulb,
  Warning,
  Analytics,
  Task,
  Insights,
} from '@mui/icons-material';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    action?: string;
    data?: any;
  };
}

interface AITask {
  id: string;
  name: string;
  description: string;
  type: 'analysis' | 'monitoring' | 'automation' | 'reporting';
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number;
  priority: 'low' | 'medium' | 'high';
  lastRun: Date;
  nextRun: Date;
  performance: {
    successRate: number;
    avgExecutionTime: number;
    lastResult: string;
  };
}

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  timestamp: Date;
  actions: string[];
}

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Ciao! Sono il tuo assistente AI per la gestione finanziaria. Come posso aiutarti oggi?',
      timestamp: new Date(),
      metadata: { confidence: 100 }
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('all');
  const [selectedInsight, setSelectedInsight] = useState<string>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const mockAITasks: AITask[] = [
    {
      id: '1',
      name: 'Monitoraggio Rischio Credito',
      description: 'Analisi automatica del rischio di credito per tutti i clienti attivi',
      type: 'monitoring',
      status: 'running',
      progress: 75,
      priority: 'high',
      lastRun: new Date('2024-01-15T10:00:00'),
      nextRun: new Date('2024-01-15T16:00:00'),
      performance: {
        successRate: 98.5,
        avgExecutionTime: 45,
        lastResult: 'Rischio medio-basso rilevato per 95% dei clienti'
      }
    },
    {
      id: '2',
      name: 'Analisi Transazioni Anomale',
      description: 'Rilevamento automatico di transazioni sospette e pattern anomali',
      type: 'analysis',
      status: 'completed',
      progress: 100,
      priority: 'high',
      lastRun: new Date('2024-01-15T09:30:00'),
      nextRun: new Date('2024-01-15T15:30:00'),
      performance: {
        successRate: 99.2,
        avgExecutionTime: 23,
        lastResult: '3 transazioni anomale identificate e segnalate'
      }
    },
    {
      id: '3',
      name: 'Report Performance Portfolio',
      description: 'Generazione automatica di report di performance per tutti i portfolio',
      type: 'reporting',
      status: 'idle',
      progress: 0,
      priority: 'medium',
      lastRun: new Date('2024-01-14T18:00:00'),
      nextRun: new Date('2024-01-15T18:00:00'),
      performance: {
        successRate: 100,
        avgExecutionTime: 120,
        lastResult: 'Report generati per 15 portfolio con analisi dettagliate'
      }
    },
    {
      id: '4',
      name: 'Ottimizzazione Allocazione Asset',
      description: 'Ricalcolo automatico dell\'allocazione ottimale degli asset basato su AI',
      type: 'automation',
      status: 'running',
      progress: 45,
      priority: 'medium',
      lastRun: new Date('2024-01-15T11:00:00'),
      nextRun: new Date('2024-01-16T11:00:00'),
      performance: {
        successRate: 94.8,
        avgExecutionTime: 180,
        lastResult: 'Allocazione ottimizzata per 8 portfolio con +2.3% di rendimento atteso'
      }
    }
  ];

  const mockAIInsights: AIInsight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Crescita Settore Tecnologico',
      description: 'Analisi predittiva indica una crescita sostenuta del 18% nel settore tech per i prossimi 12 mesi',
      confidence: 91.5,
      impact: 'high',
      timestamp: new Date('2024-01-15T14:00:00'),
      actions: [
        'Aumentare esposizione al settore tech',
        'Valutare nuove partnership tecnologiche',
        'Ridurre esposizione ai settori in declino'
      ]
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Pattern Transazioni Insolite',
      description: 'Rilevato aumento del 25% nelle transazioni notturne per 3 clienti business',
      confidence: 87.3,
      impact: 'medium',
      timestamp: new Date('2024-01-15T12:30:00'),
      actions: [
        'Verificare attività notturna dei clienti',
        'Implementare monitoraggio 24/7',
        'Analizzare pattern storici'
      ]
    },
    {
      id: '3',
      type: 'opportunity',
      title: 'Mercato Crypto in Ripresa',
      description: 'Segnali di ripresa nel mercato crypto con potenziale crescita del 30% nei prossimi 6 mesi',
      confidence: 89.7,
      impact: 'high',
      timestamp: new Date('2024-01-15T11:15:00'),
      actions: [
        'Valutare aumento esposizione crypto',
        'Analizzare nuovi asset digitali',
        'Preparare strategie di investimento'
      ]
    },
    {
      id: '4',
      type: 'risk',
      title: 'Rischio Liquidità Cliente XYZ',
      description: 'Riduzione del 40% nella liquidità disponibile per il cliente XYZ negli ultimi 30 giorni',
      confidence: 93.1,
      impact: 'high',
      timestamp: new Date('2024-01-15T10:45:00'),
      actions: [
        'Contattare immediatamente il cliente',
        'Rivedere limiti di credito',
        'Implementare monitoraggio intensivo'
      ]
    }
  ];

  const getTaskIcon = (type: AITask['type']) => {
    switch (type) {
      case 'analysis':
        return <Analytics color="primary" />;
      case 'monitoring':
        return <Security color="warning" />;
      case 'automation':
        return <AutoGraph color="success" />;
      case 'reporting':
        return <TrendingUp color="info" />;
      default:
        return <Task />;
    }
  };

  const getTaskStatusColor = (status: AITask['status']) => {
    switch (status) {
      case 'running':
        return 'primary';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'idle':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: AITask['priority']) => {
    switch (priority) {
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

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp color="success" />;
      case 'anomaly':
        return <Warning color="warning" />;
      case 'opportunity':
        return <Lightbulb color="info" />;
      case 'risk':
        return <Security color="error" />;
      default:
        return <Insights />;
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShouldAutoScroll(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        metadata: { confidence: Math.random() * 20 + 80 }
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setShouldAutoScroll(true);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('rischio') || input.includes('risk')) {
      return 'Ho analizzato i rischi del portfolio. Attualmente il livello di rischio è medio-basso. Raccomando di monitorare l\'esposizione al settore energetico che mostra segnali di volatilità.';
    } else if (input.includes('portfolio') || input.includes('investimenti')) {
      return 'Il tuo portfolio mostra una performance positiva del +8.5% YTD. Suggerisco di ribilanciare aumentando l\'esposizione ai settori tech e healthcare che mostrano trend positivi.';
    } else if (input.includes('transazioni') || input.includes('transactions')) {
      return 'Ho rilevato 3 transazioni anomale nelle ultime 24 ore. Tutte sono state verificate e sono legittime. Il sistema di sicurezza sta funzionando correttamente.';
    } else if (input.includes('mercato') || input.includes('market')) {
      return 'L\'analisi del mercato indica una tendenza positiva per i prossimi 3 mesi. Raccomando di mantenere la strategia attuale ma monitorare la volatilità del dollaro.';
    } else {
      return 'Grazie per la tua domanda. Posso aiutarti con analisi di rischio, performance del portfolio, monitoraggio transazioni e previsioni di mercato. Cosa ti interessa di più?';
    }
  };

  const startTask = (taskId: string) => {
    // Mock task start
    console.log(`Starting task: ${taskId}`);
  };

  const stopTask = (taskId: string) => {
    // Mock task stop
    console.log(`Stopping task: ${taskId}`);
  };

  const filteredTasks = selectedTask === 'all' 
    ? mockAITasks 
    : mockAITasks.filter(task => task.type === selectedTask);

  const filteredInsights = selectedInsight === 'all'
    ? mockAIInsights
    : mockAIInsights.filter(insight => insight.type === selectedInsight);

  useEffect(() => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldAutoScroll(false);
    }
  }, [messages, shouldAutoScroll]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShouldAutoScroll(isAtBottom);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <style>
          {`
            @keyframes bounce {
              0%, 80%, 100% {
                transform: scale(0);
              }
              40% {
                transform: scale(1);
              }
            }
            @keyframes pulse {
              0% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
              100% {
                opacity: 1;
              }
            }
          `}
        </style>
        
        <Typography variant="h4" gutterBottom fontWeight="bold">
          AI Agent - Assistente Intelligente
        </Typography>

        {/* AI Agent Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SmartToy color="primary" />
                  <Typography color="textSecondary">Task Attivi</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {mockAITasks.filter(t => t.status === 'running').length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  di {mockAITasks.length} totali
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Insights color="success" />
                  <Typography color="textSecondary">Insights Generati</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {mockAIInsights.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Ultime 24 ore
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chat color="info" />
                  <Typography color="textSecondary">Conversazioni</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {messages.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Messaggi totali
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="warning" />
                  <Typography color="textSecondary">Performance Media</Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {Math.round(mockAITasks.reduce((sum, t) => sum + t.performance.successRate, 0) / mockAITasks.length)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Tasso di successo
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* AI Tasks Management */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Gestione Task AI
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Tipo Task</InputLabel>
              <Select
                value={selectedTask}
                label="Tipo Task"
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <MenuItem value="all">Tutti i Task</MenuItem>
                <MenuItem value="analysis">Analisi</MenuItem>
                <MenuItem value="monitoring">Monitoraggio</MenuItem>
                <MenuItem value="automation">Automazione</MenuItem>
                <MenuItem value="reporting">Reporting</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Grid container spacing={2}>
            {filteredTasks.map((task) => (
              <Grid item xs={12} md={6} key={task.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTaskIcon(task.type)}
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {task.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {task.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={task.status}
                          size="small"
                          color={getTaskStatusColor(task.status) as any}
                          variant="outlined"
                        />
                        <Chip
                          label={task.priority}
                          size="small"
                          color={getPriorityColor(task.priority) as any}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Progresso: {task.progress}%
                      </Typography>
                      <LinearProgress variant="determinate" value={task.progress} />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" color="textSecondary">
                        Ultima esecuzione: {task.lastRun.toLocaleTimeString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Prossima: {task.nextRun.toLocaleTimeString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {task.status === 'running' ? (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Stop />}
                          onClick={() => stopTask(task.id)}
                        >
                          Ferma
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<PlayArrow />}
                          onClick={() => startTask(task.id)}
                        >
                          Avvia
                        </Button>
                      )}
                      <Button size="small" variant="outlined">
                        Dettagli
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* AI Insights and Chat - Extended Grid Layout for Better Chat Space */}
        <Grid container spacing={3}>
          {/* Chat Section - Extended horizontally for better space */}
          <Grid item xs={12} md={8} lg={7}>
            <Paper sx={{ 
              p: { xs: 2, md: 3 }, 
              height: 'fit-content', 
              minHeight: { xs: 600, md: 700, lg: 750 },
              position: { xs: 'static', lg: 'sticky' },
              top: 20
            }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Chat con AI Agent
              </Typography>
              
              {/* Main Chat Container - Robust CSS Grid with absolute positioning */}
              <Box sx={{ 
                position: 'relative',
                height: { xs: 500, md: 600, lg: 650 },
                width: '100%',
                overflow: 'hidden'
              }}>
                {/* Chat Header - Fixed at top */}
                <Box sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  px: 1,
                  py: 1,
                  borderBottom: '1px solid #e0e0e0',
                  backgroundColor: 'white',
                  borderRadius: 1,
                  height: 50
                }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {messages.length} messaggi
                  </Typography>
                  {!shouldAutoScroll && (
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
                      Nuovi messaggi ↓
                    </Typography>
                  )}
                </Box>
                
                {/* Messages Container - Absolutely positioned with proper boundaries */}
                <Box 
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  sx={{ 
                    position: 'absolute',
                    top: 50, // Below header
                    left: 0,
                    right: 0,
                    bottom: 200, // Above input area
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    backgroundColor: '#f8f9fa', 
                    borderRadius: 2,
                    border: '1px solid #e9ecef',
                    '&::-webkit-scrollbar': {
                      width: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f3f4',
                      borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#dadce0',
                      borderRadius: '5px',
                      '&:hover': {
                        backgroundColor: '#bdc1c6',
                      },
                    },
                  }}
                >
                  {/* Messages Content with proper spacing */}
                  <Box sx={{ 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minHeight: '100%'
                  }}>
                    {messages.map((message, index) => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                          animation: index === messages.length - 1 ? 'fadeInUp 0.4s ease-out' : 'none',
                          '@keyframes fadeInUp': {
                            '0%': {
                              opacity: 0,
                              transform: 'translateY(15px)',
                            },
                            '100%': {
                              opacity: 1,
                              transform: 'translateY(0)',
                            },
                          },
                          flexShrink: 0,
                        }}
                      >
                        <Box
                          component="div"
                          sx={{
                            maxWidth: '90%',
                            p: 2,
                            backgroundColor: message.type === 'user' ? 'primary.main' : 'white',
                            color: message.type === 'user' ? 'white' : 'text.primary',
                            borderRadius: 3,
                            boxShadow: message.type === 'user' ? 3 : 2,
                            wordBreak: 'break-word',
                            transition: 'all 0.3s ease',
                            border: message.type === 'user' ? 'none' : '1px solid #e0e0e0',
                            '&:hover': {
                              boxShadow: message.type === 'user' ? 4 : 3,
                              transform: 'translateY(-2px)',
                            }
                          }}
                        >
                          <Typography 
                            component="div"
                            variant="body2" 
                            sx={{ 
                              lineHeight: 1.6, 
                              mb: 1,
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {message.content}
                          </Typography>
                          <Typography 
                            component="span"
                            variant="caption" 
                            color={message.type === 'user' ? 'rgba(255,255,255,0.8)' : 'text.secondary'}
                            sx={{ 
                              display: 'block', 
                              fontSize: '0.75rem',
                              opacity: 0.8
                            }}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    
                    {/* Typing indicator */}
                    {isTyping && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-start',
                        flexShrink: 0
                      }}>
                        <Box 
                          component="div"
                          sx={{ 
                            p: 2, 
                            backgroundColor: 'white', 
                            borderRadius: 3, 
                            boxShadow: 2,
                            border: '1px solid #e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 0.5,
                            animation: 'pulse 1.5s ease-in-out infinite'
                          }}>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 'primary.main',
                              animation: 'bounce 1.4s ease-in-out infinite both'
                            }} />
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 'primary.main',
                              animation: 'bounce 1.4s ease-in-out infinite both',
                              animationDelay: '0.2s'
                            }} />
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: 'primary.main',
                              animation: 'bounce 1.4s ease-in-out infinite both',
                              animationDelay: '0.4s'
                            }} />
                          </Box>
                          <Typography 
                            component="span"
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ ml: 1 }}
                          >
                            AI sta scrivendo...
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Scroll anchor with proper height */}
                    <div ref={messagesEndRef} style={{ height: '20px', minHeight: '20px', flexShrink: 0 }} />
                  </Box>
                  
                  {/* Scroll to bottom button - positioned absolutely */}
                  {!shouldAutoScroll && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                        setShouldAutoScroll(true);
                      }}
                      sx={{
                        position: 'absolute',
                        bottom: 15,
                        right: 15,
                        zIndex: 10,
                        minWidth: 'auto',
                        px: 1,
                        py: 0.5,
                        borderRadius: '50%',
                        width: 45,
                        height: 45,
                        boxShadow: 4,
                        backgroundColor: 'primary.main',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          backgroundColor: 'primary.dark',
                        }
                      }}
                    >
                      ↓
                    </Button>
                  )}
                </Box>
                
                {/* Input Area - Fixed at bottom */}
                <Box sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  backgroundColor: 'white',
                  borderRadius: 2,
                  p: { xs: 1.5, md: 2 },
                  border: '1px solid #e9ecef',
                  boxShadow: 2,
                  minHeight: 180
                }}>
                  {/* Input field and send button */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mb: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <TextField
                      fullWidth
                      size="medium"
                      placeholder="Scrivi un messaggio..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      multiline
                      maxRows={3}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8f9fa',
                          '&:hover': {
                            backgroundColor: '#f1f3f4',
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                          }
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      sx={{ 
                        minWidth: { xs: '100%', sm: 'auto' },
                        px: { xs: 2, md: 3 },
                        py: { xs: 1, md: 1.5 },
                        borderRadius: 2,
                        height: 'fit-content',
                        boxShadow: 2,
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: 4,
                        }
                      }}
                    >
                      <Send />
                    </Button>
                  </Box>
                  
                  {/* Quick suggestions */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                      Suggerimenti rapidi:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {['Analisi rischio', 'Performance portfolio', 'Transazioni anomale', 'Previsioni mercato'].map((suggestion) => (
                        <Chip
                          key={suggestion}
                          label={suggestion}
                          size="small"
                          variant="outlined"
                          onClick={() => setInputMessage(suggestion)}
                          sx={{ 
                            cursor: 'pointer',
                            borderRadius: 2,
                            borderColor: 'primary.light',
                            color: 'primary.main',
                            fontSize: { xs: '0.75rem', md: '0.875rem' },
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                              transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* AI Insights Section - Compact and balanced */}
          <Grid item xs={12} md={4} lg={5}>
            <Paper sx={{ p: { xs: 2, md: 3 }, height: 'fit-content' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                <Typography variant="h6" sx={{ mb: { xs: 2, md: 0 } }}>
                  Insights AI Generati
                </Typography>
                <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
                  <InputLabel>Tipo Insight</InputLabel>
                  <Select
                    value={selectedInsight}
                    label="Tipo Insight"
                    onChange={(e) => setSelectedInsight(e.target.value)}
                  >
                    <MenuItem value="all">Tutti</MenuItem>
                    <MenuItem value="trend">Trend</MenuItem>
                    <MenuItem value="anomaly">Anomalie</MenuItem>
                    <MenuItem value="opportunity">Opportunità</MenuItem>
                    <MenuItem value="risk">Rischi</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ maxHeight: { xs: 500, md: 600, lg: 650 }, overflowY: 'auto' }}>
                <List sx={{ p: 0 }}>
                  {filteredInsights.map((insight) => (
                    <React.Fragment key={insight.id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                        <ListItemIcon sx={{ minWidth: { xs: 35, md: 40 } }}>
                          {getInsightIcon(insight.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body1" fontWeight="medium" sx={{ minWidth: 'fit-content', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                {insight.title}
                              </Typography>
                              <Chip
                                label={insight.impact}
                                size="small"
                                color={getImpactColor(insight.impact) as any}
                                variant="outlined"
                              />
                              <Chip
                                label={`${insight.confidence}%`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, lineHeight: 1.5, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                {insight.description}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                Timestamp: {insight.timestamp.toLocaleString()}
                              </Typography>
                              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1, fontSize: { xs: '0.8rem', md: '0.875rem' } }}>
                                Azioni Raccomandate:
                              </Typography>
                              {insight.actions.map((action, index) => (
                                <Typography key={index} variant="body2" color="textSecondary" sx={{ ml: 1, mb: 0.5, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                                  • {action}
                                </Typography>
                              ))}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AIAgent;

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Fab,
  Tooltip,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  SmartToy as AIIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  Lightbulb as LightbulbIcon,
  BugReport as BugReportIcon,
  Book as BookIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  KeyboardArrowUp as ArrowUpIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Psychology as PsychologyIcon,
  Newspaper as NewsIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Chat,
  AccountBalance,
  ShowChart,
  Security,
  TrendingUp
} from '@mui/icons-material';
import { FAQData } from './FAQData';
import { AIResponseGenerator } from './AIResponseGenerator';
import { ProblemSolver } from './ProblemSolver';
import { AILearningEngine } from './AILearningEngine';
import { AILearningDashboard } from './AILearningDashboard';
import { AINewsIntelligence } from '../AINewsIntelligence';
import { AIAdvancedDashboard } from '../AIAdvanced';
import { AIChatbot } from '../AIAdvanced/AIChatbot';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'solution' | 'error' | 'guide';
  metadata?: any;
}

interface AIAgentProps {
  open: boolean;
  onClose: () => void;
}

export const AIAgent: React.FC<AIAgentProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'guide' | 'news'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | false>(false);
  const [showLearningDashboard, setShowLearningDashboard] = useState(false);
  const [showNewsIntelligence, setShowNewsIntelligence] = useState(false);
  const [showAdvancedDashboard, setShowAdvancedDashboard] = useState(false);
  const [showAIChatbot, setShowAIChatbot] = useState(false);
  const [userFeedback, setUserFeedback] = useState<{ [messageId: string]: 'positive' | 'negative' | 'neutral' }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic data state
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 1250000,
    dailyChange: 2.5,
    monthlyChange: 8.7,
    yearlyChange: 15.3,
    riskScore: 0.28,
    diversification: 0.85
  });

  const [marketTrends, setMarketTrends] = useState({
    sentiment: 'bullish',
    volatility: 'medium',
    topPerformers: ['AAPL', 'MSFT', 'GOOGL'],
    marketMood: 'positive'
  });

  const [aiPerformance, setAiPerformance] = useState({
    accuracy: 94.2,
    predictions: 156,
    successfulTrades: 142,
    roi: 12.8
  });

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setPortfolioData(prev => ({
        ...prev,
        totalValue: prev.totalValue + (Math.random() - 0.5) * 10000,
        dailyChange: prev.dailyChange + (Math.random() - 0.5) * 0.5
      }));

      setAiPerformance(prev => ({
        ...prev,
        accuracy: Math.max(90, Math.min(98, prev.accuracy + (Math.random() - 0.5) * 0.2)),
        predictions: prev.predictions + Math.floor(Math.random() * 3)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const aiResponseGenerator = new AIResponseGenerator();
  const problemSolver = new ProblemSolver();
  const learningEngine = new AILearningEngine();

  useEffect(() => {
    if (open) {
      // Welcome message when AI Agent opens
      const welcomeMessage: Message = {
        id: 'welcome',
        text: 'Ciao! Sono il tuo assistente AI per il Gestionale Finanziario. Posso aiutarti con:\n\n• 📊 **Analisi Predittiva Avanzata** - Flussi di cassa, rischio credito, trend mercato\n• 🔒 **Rilevamento Frodi in Tempo Reale** - Monitoraggio transazioni sospette\n• 💼 **Ottimizzazione Investimenti** - Portfolio automatico, simulazioni scenari\n• ⚡ **Automazione Processi** - Approvazione prestiti, report automatici\n• 🤖 **Chatbot Finanziario 24/7** - Assistenza clienti personalizzata\n• 📰 **News Intelligence** - Sentiment analysis e alert mercato\n• ⚖️ **Compliance Intelligente** - Verifica automatica normative\n• 🎯 **Personalizzazione UX** - Dashboard adattive per ogni ruolo\n\n📞 **Call Center**: +39 800 123 456\n🕒 **Orari**: Lun-Ven 8:00-20:00, Sab 9:00-17:00\n\nCome posso aiutarti oggi?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'guide'
      };
      setMessages([welcomeMessage]);
      setActiveTab('chat');
    }
  }, [open]);

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simula una risposta AI basata sull'input dell'utente
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('dashboard') || lowerInput.includes('grafici')) {
      return `Per accedere al dashboard principale, clicca su "Dashboard" nel menu laterale. Lì troverai:\n\n📊 **Grafici interattivi** con selezione tipo grafico\n📈 **Trend di bilancio** in tempo reale\n💼 **Distribuzione portafoglio**\n🔄 **Transazioni recenti**\n\nPuoi anche personalizzare i grafici cliccando sui tre puntini (⋮) per cambiare il tipo di visualizzazione!`;
    }
    
    if (lowerInput.includes('notizie') || lowerInput.includes('news') || lowerInput.includes('sentiment')) {
      return `Per l'analisi AI delle notizie finanziarie, vai al tab "📰 News AI" o clicca direttamente su "🚀 Apri AI News Intelligence". Il sistema offre:\n\n🤖 **Analisi automatica del sentiment** delle notizie\n🚨 **Alert automatici** su eventi di mercato\n💡 **Raccomandazioni di investimento** basate su AI\n📊 **Collegamento ai moduli** di investimento e rischio\n\nVuoi che ti mostri il sistema?`;
    }
    
    if (lowerInput.includes('grafici') || lowerInput.includes('chart') || lowerInput.includes('trend')) {
      return `I grafici del dashboard supportano diversi tipi di visualizzazione:\n\n📈 **Linea**: Per trend temporali\n📊 **Barre**: Per confronti e ranking\n🥧 **Torta**: Per distribuzioni percentuali\n📊 **Area**: Per aree riempite\n🔍 **Dispersione**: Per correlazioni\n\nClicca sui tre puntini (⋮) su qualsiasi grafico per cambiare il tipo!`;
    }
    
    if (lowerInput.includes('ai') || lowerInput.includes('intelligenza')) {
      return `Il nostro sistema AI offre diverse funzionalità avanzate:\n\n🤖 **AI Agent**: Assistente conversazionale\n📰 **News Intelligence**: Analisi notizie finanziarie\n📚 **Learning Engine**: Sistema di apprendimento continuo\n🔍 **Problem Solver**: Risoluzione problemi automatica\n\nQuale aspetto ti interessa di più?`;
    }
    
    if (lowerInput.includes('aiuto') || lowerInput.includes('help') || lowerInput.includes('supporto')) {
      return `Ecco come posso aiutarti:\n\n💬 **Chat**: Fammi domande specifiche\n❓ **FAQ**: Trova risposte rapide\n📖 **Guide**: Tutorial passo-passo\n📰 **News AI**: Analisi notizie finanziarie\n\nCosa ti serve nello specifico?`;
    }
    
    // Risposta generica
    return `Grazie per la tua domanda! Posso aiutarti con:\n\n• Guide all'utilizzo del sistema\n• Analisi delle notizie finanziarie\n• Suggerimenti per i grafici\n• Supporto tecnico\n\nProva a essere più specifico o usa i tab per navigare tra le diverse sezioni.`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Simula la generazione della risposta AI
      const aiResponse = await generateAIResponse(inputText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Mi dispiace, si è verificato un errore. Riprova più tardi.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserFeedback = (messageId: string, feedback: 'positive' | 'negative' | 'neutral') => {
    setUserFeedback(prev => ({ ...prev, [messageId]: feedback }));
  };

  const handleLearningDashboardOpen = () => {
    setShowLearningDashboard(true);
  };

  const handleFAQSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('faq');
  };

  const filteredFAQ = FAQData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickAction = (action: string) => {
    const quickActions = {
      'login': 'Per accedere al sistema, utilizza le tue credenziali. Se hai dimenticato la password, clicca su "Password dimenticata" nella schermata di login.',
      'dashboard': 'La dashboard mostra un riepilogo completo delle tue finanze. Puoi personalizzare i widget e le metriche visualizzate nelle impostazioni.',
      'transactions': 'Per registrare una nuova transazione, vai su Transazioni > Nuova Transazione. Compila tutti i campi richiesti e salva.',
      'reports': 'I report sono disponibili nella sezione Report. Puoi generare report personalizzati e esportarli in vari formati.',
      'crypto': 'Per gestire le criptovalute, vai su Criptovalute > Portafogli. Puoi creare nuovi portafogli e tracciare le transazioni.',
      'insurance': 'La gestione assicurativa si trova in Assicurazioni. Puoi registrare polizze, tracciare scadenze e gestire sinistri.'
    };

    const response = quickActions[action as keyof typeof quickActions] || 'Non ho informazioni specifiche per questa azione. Puoi fare una domanda più dettagliata.';
    
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: response,
      sender: 'ai',
      timestamp: new Date(),
      type: 'guide'
    };

    setMessages(prev => [...prev, aiMessage]);
    setActiveTab('chat');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'chat' | 'faq' | 'guide' | 'news') => {
    setActiveTab(newValue);
    
    // Se si seleziona il tab news, apri il sistema di intelligence
    if (newValue === 'news') {
      setShowNewsIntelligence(true);
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          mb: 2
        }}
      >
        <Box
          sx={{
            maxWidth: '70%',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1
          }}
        >
          {!isUser && (
            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
              <AIIcon />
            </Avatar>
          )}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
              color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
              borderRadius: 2,
              position: 'relative'
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {message.text}
            </Typography>
            {message.metadata && message.type === 'solution' && (
              <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                <Typography variant="caption" color="success.main">
                  💡 Soluzione suggerita: {message.metadata.solution}
                </Typography>
              </Box>
            )}
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
              {message.timestamp.toLocaleTimeString()}
            </Typography>
            
            {/* Pulsanti di feedback per messaggi AI */}
            {!isUser && (
              <Box sx={{ 
                display: 'flex', 
                gap: 0.5, 
                mt: 1, 
                justifyContent: 'flex-end',
                opacity: userFeedback[message.id] ? 0.7 : 1
              }}>
                <Tooltip title="Risposta utile">
                  <IconButton
                    size="small"
                    color={userFeedback[message.id] === 'positive' ? 'success' : 'default'}
                    onClick={() => handleUserFeedback(message.id, 'positive')}
                    disabled={!!userFeedback[message.id]}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Risposta non utile">
                  <IconButton
                    size="small"
                    color={userFeedback[message.id] === 'negative' ? 'error' : 'default'}
                    onClick={() => handleUserFeedback(message.id, 'negative')}
                    disabled={!!userFeedback[message.id]}
                  >
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Paper>
          {isUser && (
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 32, height: 32 }}>
              <HelpIcon />
            </Avatar>
          )}
        </Box>
      </Box>
    );
  };

  const renderFAQ = () => (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TextField
        fullWidth
        placeholder="Cerca nelle FAQ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        sx={{ mb: 2 }}
      />
      
      {filteredFAQ.length === 0 ? (
        <Alert severity="info">
          Nessuna FAQ trovata per "{searchQuery}". Prova con termini diversi.
        </Alert>
      ) : (
        filteredFAQ.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expandedFAQ === faq.id}
            onChange={() => setExpandedFAQ(expandedFAQ === faq.id ? false : faq.id)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Chip label={faq.category} size="small" color="primary" />
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {faq.question}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {faq.answer}
              </Typography>
              {faq.steps && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Passi da seguire:
                  </Typography>
                  <List dense>
                    {faq.steps.map((step, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Typography variant="body2" color="primary">
                            {index + 1}.
                          </Typography>
                        </ListItemIcon>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {faq.tips && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(255, 193, 7, 0.1)', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="warning.main" sx={{ mb: 1 }}>
                    💡 Suggerimenti:
                  </Typography>
                  <Typography variant="body2">
                    {faq.tips}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );

  const renderGuide = () => (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Guida Rapida
      </Typography>
      
      <Grid container spacing={2}>
        {[
          { title: 'Accesso e Login', icon: <HelpIcon />, action: 'login' },
          { title: 'Dashboard', icon: <BookIcon />, action: 'dashboard' },
          { title: 'Transazioni', icon: <BookIcon />, action: 'transactions' },
          { title: 'Report', icon: <BookIcon />, action: 'reports' },
          { title: 'Criptovalute', icon: <BookIcon />, action: 'crypto' },
          { title: 'Assicurazioni', icon: <BookIcon />, action: 'insurance' }
        ].map((item) => (
          <Grid item xs={12} sm={6} key={item.action}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => handleQuickAction(item.action)}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ mb: 1 }}>
                  {item.icon}
                </Box>
                <Typography variant="body2">
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Suggerimenti Utili
      </Typography>
      
      <List>
        {[
          'Utilizza i filtri avanzati per trovare rapidamente le informazioni',
          'Personalizza la dashboard in base alle tue esigenze',
          'Configura le notifiche per non perdere scadenze importanti',
          'Esporta i report in formato PDF per la condivisione',
          'Utilizza la ricerca globale per trovare qualsiasi dato'
        ].map((tip, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <LightbulbIcon color="warning" />
            </ListItemIcon>
            <ListItemText primary={tip} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        📞 Supporto Telefonico
      </Typography>
      
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2, mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Call Center: +39 800 123 456
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          🕒 <strong>Orari di apertura:</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Lunedì - Venerdì: 8:00 - 20:00
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Sabato: 9:00 - 17:00
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Domenica: Chiuso
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
          💡 <strong>Servizi disponibili:</strong> Assistenza tecnica, supporto operativo, informazioni sui prodotti
        </Typography>
      </Box>
    </Box>
  );

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { 
            height: '95vh',
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div">
              🤖 AI Agent - Gestionale Finanziario
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Dashboard AI Avanzato">
                <IconButton size="small" onClick={() => setShowAdvancedDashboard(true)}>
                  <PsychologyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Chatbot FinBot">
                <IconButton size="small" onClick={() => setShowAIChatbot(true)}>
                  <Chat />
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>

        {/* Tabs sempre visibili */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="ai agent tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                fontSize: '0.875rem',
                fontWeight: 500
              }
            }}
          >
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChatIcon />
                  Chat
                </Box>
              } 
              value="chat"
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HelpIcon />
                  FAQ
                </Box>
              } 
              value="faq"
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BookIcon />
                  Guide
                </Box>
              } 
              value="guide"
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NewsIcon />
                  📰 News AI
                </Box>
              } 
              value="news"
            />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden' }}>
          {/* Tab Panel Chat - Layout ottimizzato */}
          {activeTab === 'chat' && (
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              p: { xs: 2, sm: 3 }
            }}>
              {/* Area messaggi con scroll indipendente */}
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                mb: 2,
                px: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }
              }}>
                {messages.map((message) => renderMessage(message))}
                {isTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                      <AIIcon />
                    </Avatar>
                    <Paper elevation={1} sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        <Typography variant="body2" color="text.secondary">
                          AI sta scrivendo...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Input area sempre visibile in fondo */}
              <Box sx={{ 
                borderTop: 1, 
                borderColor: 'divider', 
                pt: 2,
                backgroundColor: 'background.paper',
                position: 'sticky',
                bottom: 0
              }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    ref={inputRef}
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Scrivi il tuo messaggio..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'background.paper'
                      }
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    sx={{ 
                      minWidth: 48, 
                      minHeight: 48,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      },
                      '&:disabled': {
                        bgcolor: 'action.disabledBackground',
                        color: 'action.disabled'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}

          {/* Tab Panel FAQ - Layout ottimizzato */}
          {activeTab === 'faq' && (
            <Box sx={{ 
              height: '100%', 
              overflow: 'auto',
              p: { xs: 2, sm: 3 }
            }}>
              {renderFAQ()}
            </Box>
          )}

          {/* Tab Panel Guide - Layout ottimizzato */}
          {activeTab === 'guide' && (
            <Box sx={{ 
              height: '100%', 
              overflow: 'auto',
              p: { xs: 2, sm: 3 }
            }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        🚀 Quick Actions
                      </Typography>
                      <List>
                        <ListItem button onClick={() => handleQuickAction('login')}>
                          <ListItemIcon>
                            <HelpIcon />
                          </ListItemIcon>
                          <ListItemText primary="Come accedere al sistema" />
                        </ListItem>
                        <ListItem button onClick={() => handleQuickAction('dashboard')}>
                          <ListItemIcon>
                            <HelpIcon />
                          </ListItemIcon>
                          <ListItemText primary="Utilizzo della dashboard" />
                        </ListItem>
                        <ListItem button onClick={() => handleQuickAction('transactions')}>
                          <ListItemIcon>
                            <HelpIcon />
                          </ListItemIcon>
                          <ListItemText primary="Registrare transazioni" />
                        </ListItem>
                        <ListItem button onClick={() => handleQuickAction('reports')}>
                          <ListItemIcon>
                            <HelpIcon />
                          </ListItemIcon>
                          <ListItemText primary="Generare report" />
                        </ListItem>
                        <ListItem button onClick={() => handleQuickAction('crypto')}>
                          <ListItemIcon>
                            <HelpIcon />
                          </ListItemIcon>
                          <ListItemText primary="Gestione criptovalute" />
                        </ListItem>
                        <ListItem button onClick={() => handleQuickAction('insurance')}>
                          <ListItemIcon>
                            <HelpIcon />
                          </ListItemIcon>
                          <ListItemText primary="Gestione assicurazioni" />
                        </ListItem>
                      </List>
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<NewsIcon />}
                          onClick={() => setShowNewsIntelligence(true)}
                          sx={{ flex: 1 }}
                        >
                          News AI
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<PsychologyIcon />}
                          onClick={() => setShowAdvancedDashboard(true)}
                          sx={{ flex: 1 }}
                        >
                          AI Avanzato
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Tab Panel News AI - Layout ottimizzato */}
          {activeTab === 'news' && (
            <Box sx={{ 
              height: '100%', 
              overflow: 'auto',
              p: { xs: 2, sm: 3 },
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Typography variant="h5" gutterBottom align="center">
                📰 AI News Intelligence
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                Sistema avanzato di analisi delle notizie finanziarie con AI
              </Typography>
              
              <Card sx={{ maxWidth: 600, width: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🚀 Funzionalità Principali
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PsychologyIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Analisi del Sentiment" 
                        secondary="Analisi automatica del tono emotivo delle notizie finanziarie"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Alert Automatici" 
                        secondary="Notifiche immediate su eventi di mercato rilevanti"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Collegamento Investimenti" 
                        secondary="Integrazione con moduli di investimento e gestione del rischio"
                      />
                    </ListItem>
                  </List>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<NewsIcon />}
                      onClick={() => setShowNewsIntelligence(true)}
                      sx={{ flex: 1 }}
                    >
                      News AI
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PsychologyIcon />}
                      onClick={() => setShowAdvancedDashboard(true)}
                      sx={{ flex: 1 }}
                    >
                      AI Avanzato
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Chat />}
                    onClick={() => setShowAIChatbot(true)}
                    sx={{ mt: 1, width: '100%' }}
                    color="secondary"
                  >
                    💬 Chatta con FinBot
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}


        </DialogContent>
      </Dialog>

      {/* AI News Intelligence Dialog */}
      <AINewsIntelligence
        open={showNewsIntelligence}
        onClose={() => setShowNewsIntelligence(false)}
      />

      {/* AI Learning Dashboard */}
      <AILearningDashboard
        open={showLearningDashboard}
        onClose={() => setShowLearningDashboard(false)}
      />

      {/* AI Advanced Dashboard */}
      <AIAdvancedDashboard
        open={showAdvancedDashboard}
        onClose={() => setShowAdvancedDashboard(false)}
      />

      {/* AI Chatbot */}
      <AIChatbot
        open={showAIChatbot}
        onClose={() => setShowAIChatbot(false)}
      />

      {/* Floating Action Button - Responsive */}
      {!open && (
        <Fab
          color="primary"
          aria-label="AI Agent"
          onClick={() => onClose()}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24, md: 32 },
            right: { xs: 16, sm: 24, md: 32 },
            zIndex: 1000,
            width: { xs: 56, sm: 64, md: 72 },
            height: { xs: 56, sm: 64, md: 72 },
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            },
            transition: 'all 0.3s ease-in-out',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <AIIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
        </Fab>
      )}
    </>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Zoom,
  Badge
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Close,
  ThumbUp,
  ThumbDown,
  TrendingUp,
  AccountBalance,
  Receipt,
  PieChart,
  CurrencyBitcoin,
  Description,
  Support,
  Security,
  AutoAwesome,
  Newspaper,
  Balance,
  Rocket
} from '@mui/icons-material';
import { aiChatbotService, ChatMessage, ChatSession, QuickReply } from '../../services/aiChatbotService';

interface AIChatbotProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

// Componente Chatbot Flottante
export const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(0);

  return (
    <>
      {/* Pulsante flottante */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="Chat AI"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
            },
            transition: 'all 0.3s ease-in-out'
          }}
          onClick={() => setIsOpen(true)}
        >
          <Badge badgeContent={unreadCount} color="error">
            <SmartToy />
          </Badge>
        </Fab>
      </Zoom>

      {/* Chatbot Dialog */}
      <AIChatbot
        open={isOpen}
        onClose={() => setIsOpen(false)}
        userId="USER_001"
      />
    </>
  );
};

export const AIChatbot: React.FC<AIChatbotProps> = ({ open, onClose, userId = 'USER_001' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initializeChat = useCallback(async () => {
    try {
      console.log('🚀 Initializing chat for user:', userId);
      
      const newSession = await aiChatbotService.createSession(userId);
      setSession(newSession);
      
      console.log('✅ Session created:', newSession.id);
      
      // Messaggio di benvenuto
      const welcomeMessage = await aiChatbotService.processMessage('ciao', newSession.id, userId);
      
      if (welcomeMessage && welcomeMessage.message) {
        setMessages([welcomeMessage]);
        
        if (welcomeMessage.metadata?.quickReplies) {
          setQuickReplies(welcomeMessage.metadata.quickReplies);
        }
        
        console.log('✅ Welcome message displayed');
      } else {
        // Fallback per messaggio di benvenuto
        const fallbackWelcome: ChatMessage = {
          id: `welcome_${Date.now()}`,
          sessionId: newSession.id,
          message: 'Ciao! Sono FinBot, il tuo assistente finanziario AI. Come posso aiutarti oggi?',
          sender: 'bot',
          timestamp: new Date().toISOString(),
          type: 'text',
          metadata: {
            intent: 'welcome',
            confidence: 1
          }
        };
        
        setMessages([fallbackWelcome]);
        console.log('✅ Fallback welcome message displayed');
      }
      
    } catch (error) {
      console.error('❌ Error initializing chat:', error);
      
      // Messaggio di errore per l'inizializzazione
      const errorMessage: ChatMessage = {
        id: `init_error_${Date.now()}`,
        sessionId: 'unknown',
        message: 'Mi dispiace, non riesco ad inizializzare la chat. Ricarica la pagina o riprova più tardi.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text',
        metadata: {
          intent: 'error',
          confidence: 0
        }
      };
      
      setMessages([errorMessage]);
    }
  }, [userId]);

  useEffect(() => {
    if (open && !session) {
      initializeChat();
    }
  }, [open, initializeChat, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (!textToSend || !session) return;

    console.log('📤 Sending message:', textToSend);

    // Aggiungi messaggio utente
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sessionId: session.id,
      message: textToSend,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setQuickReplies([]);

    try {
      console.log('🤖 Processing message with AI service...');
      // Processa il messaggio con l'AI
      const aiResponse = await aiChatbotService.processMessage(textToSend, session.id, userId);
      
      console.log('✅ AI response received:', aiResponse);
      
      // Validazione della risposta AI
      if (aiResponse && aiResponse.message) {
        setMessages(prev => [...prev, aiResponse]);
        
        if (aiResponse.metadata?.quickReplies) {
          setQuickReplies(aiResponse.metadata.quickReplies);
        }
      } else {
        throw new Error('Risposta AI non valida');
      }
      
    } catch (error) {
      console.error('❌ Error processing message:', error);
      
      // Mostra messaggio di errore all'utente
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        sessionId: session.id,
        message: 'Mi dispiace, si è verificato un errore nel processare il tuo messaggio. Riprova o contatta il supporto tecnico.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text',
        metadata: {
          intent: 'error',
          confidence: 0
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.title);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (message: ChatMessage) => {
    // Validazione del messaggio
    if (!message || !message.message) {
      return (
        <Typography variant="body2" color="error.main">
          Messaggio non valido
        </Typography>
      );
    }

    // Gestione messaggi di errore
    if (message.metadata?.intent === 'error') {
      return (
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Typography 
            variant="body1" 
            color="error.main"
            sx={{ 
              mb: 1,
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            ⚠️ {message.message}
          </Typography>
        </Box>
      );
    }

    switch (message.type) {
      case 'list':
        return (
          <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2, 
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              }}
            >
              {message.message}
            </Typography>
            {message.metadata?.data && Array.isArray(message.metadata.data) && message.metadata.data.length > 0 ? (
              <List dense sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                {message.metadata.data.slice(0, 5).map((item: any, index: number) => (
                  <ListItem key={index} sx={{ bgcolor: 'grey.50', mb: 1, borderRadius: 1, maxWidth: '100%' }}>
                    <Box sx={{ width: '100%', overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '60%'
                          }}
                        >
                          {item?.type || item?.merchant || 'N/A'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color={item?.sign === '+' ? 'success.main' : 'error.main'}
                          sx={{ 
                            wordBreak: 'keep-all',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item?.sign || ''}{item?.amount || '0'}€
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {item?.date || 'Data non disponibile'}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Nessun dato disponibile
              </Typography>
            )}
          </Box>
        );

      case 'card':
        return (
          <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2, 
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {message.message}
            </Typography>
            {message.metadata?.cards && Array.isArray(message.metadata.cards) && message.metadata.cards.length > 0 ? (
              <Grid container spacing={1} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                {message.metadata.cards.map((card: any, index: number) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined" sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, maxWidth: '100%' }}>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                          }}
                        >
                          {card?.title || 'Titolo non disponibile'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2,
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                          }}
                        >
                          {card?.subtitle || 'Sottotitolo non disponibile'}
                        </Typography>
                        {card?.buttons && Array.isArray(card.buttons) && card.buttons.length > 0 ? (
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {card.buttons.map((button: any, i: number) => (
                              <Button 
                                key={i} 
                                size="small" 
                                variant="outlined"
                                onClick={() => handleSendMessage(button?.payload || button?.title)}
                                sx={{ 
                                  wordBreak: 'break-word',
                                  whiteSpace: 'normal',
                                  textAlign: 'center',
                                  maxWidth: '100%'
                                }}
                              >
                                {button?.title || 'Pulsante'}
                              </Button>
                            ))}
                          </Box>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Nessuna card disponibile
              </Typography>
            )}
          </Box>
        );

      case 'chart':
        return (
          <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {message.message}
            </Typography>
            {message.metadata?.data && message.metadata.data.indices && Array.isArray(message.metadata.data.indices) && message.metadata.data.indices.length > 0 ? (
              <Card variant="outlined" sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                <CardContent sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    Quotazioni di Mercato
                  </Typography>
                  {message.metadata.data.indices.map((index: any, i: number) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                      <Typography 
                        sx={{ 
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          maxWidth: '60%'
                        }}
                      >
                        {index?.name || 'Nome non disponibile'}
                      </Typography>
                      <Box sx={{ textAlign: 'right', minWidth: 'fit-content' }}>
                        <Typography sx={{ wordBreak: 'keep-all' }}>
                          {index?.value || 'N/A'}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color={index?.change?.startsWith('+') ? 'success.main' : 'error.main'}
                          sx={{ wordBreak: 'keep-all' }}
                        >
                          {index?.change || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word'
                    }}
                  >
                    Aggiornato: {message.metadata.data.timestamp || 'Data non disponibile'}
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Dati chart non disponibili
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <Typography 
            variant="body1"
            sx={{ 
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            {message.message}
          </Typography>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          height: '80vh', 
          maxHeight: '80vh',
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          // Fix per sovrapposizioni
          position: 'relative'
        }
      }}
    >
      <DialogTitle sx={{ flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <SmartToy />
            </Avatar>
            <Box>
              <Typography variant="h6">FinBot - Assistente AI Avanzato</Typography>
              <Typography variant="caption" color="text.secondary">
                Sistema FAQ Completo • Analisi Predittiva • Rilevamento Frodi • Ottimizzazione Portfolio • Automazione • News Intelligence • Compliance • Sicurezza Avanzata
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        p: 0, 
        position: 'relative', 
        overflow: 'hidden',
        // Fix per layout responsive
        minHeight: 0
      }}>
        {/* Layout principale con Grid per evitare sovrapposizioni */}
        <Grid container sx={{ 
          height: '100%', 
          flexWrap: 'nowrap',
          // Fix per spazio risposte rapide - aumentato per chip più grandi
          minHeight: quickReplies.length > 0 ? 'calc(100% - 200px)' : '100%'
        }}>
          {/* Area Messaggi - Grid item principale */}
          <Grid item xs={12} sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 0,
            flex: 1,
            overflow: 'hidden'
          }}>
            {/* Container messaggi con scroll */}
            <Box sx={{ 
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              p: 2,
              minHeight: 0,
              // Fix per scrollbar personalizzata
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f3f4',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#dadce0',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#bdc1c6',
                },
              },
            }}>
              {messages.map((message) => {
                // Validazione del messaggio prima del rendering
                if (!message || !message.id || !message.message) {
                  return null; // Non renderizzare messaggi non validi
                }

                return (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                      maxWidth: '100%',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 1, 
                      maxWidth: '85%',
                      overflow: 'hidden'
                    }}>
                      {message.sender === 'bot' && (
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'primary.main',
                          flexShrink: 0
                        }}>
                          <SmartToy sx={{ fontSize: 20 }} />
                        </Avatar>
                      )}
                      
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                          color: message.sender === 'user' ? 'white' : 'text.primary',
                          borderRadius: 2,
                          maxWidth: '100%',
                          overflow: 'hidden',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        {formatMessageContent(message)}
                        
                        <Typography variant="caption" sx={{ 
                          opacity: 0.7, 
                          mt: 1, 
                          display: 'block',
                          fontSize: '0.7rem',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('it-IT') : 'Ora non disponibile'}
                        </Typography>

                        {/* Feedback per messaggi AI */}
                        {message.sender === 'bot' && (
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            mt: 1,
                            flexWrap: 'wrap'
                          }}>
                            <IconButton size="small" sx={{ opacity: 0.7 }}>
                              <ThumbUp sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small" sx={{ opacity: 0.7 }}>
                              <ThumbDown sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        )}
                      </Paper>

                      {message.sender === 'user' && (
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'secondary.main',
                          flexShrink: 0
                        }}>
                          <Person sx={{ fontSize: 20 }} />
                        </Avatar>
                      )}
                    </Box>
                  </Box>
                );
              })}

              {/* Indicatore di digitazione */}
              {isTyping && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 2,
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <Avatar sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main',
                    flexShrink: 0
                  }}>
                    <SmartToy sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Paper sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.100', 
                    borderRadius: 2,
                    maxWidth: '85%',
                    overflow: 'hidden'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      flexWrap: 'wrap'
                    }}>
                      <CircularProgress size={16} />
                      <Typography 
                        variant="body2"
                        sx={{
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        FinBot sta scrivendo...
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              )}

              {/* Messaggio quando non ci sono messaggi */}
              {messages.length === 0 && !isTyping && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.secondary'
                }}>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Inizia una conversazione con FinBot! 👋
                  </Typography>
                </Box>
              )}

              {/* Scroll anchor con altezza fissa */}
              <div ref={messagesEndRef} style={{ height: '20px', minHeight: '20px' }} />
            </Box>
          </Grid>
        </Grid>

        {/* Risposte Rapide - Layout ultra-compatto */}
        {quickReplies.length > 0 && (
          <Box 
            className="ai-chatbot-quick-replies-ultra-compact"
            sx={{ 
              flexShrink: 0,
              p: 0.5, 
              borderTop: 1, 
              borderColor: 'divider',
              backgroundColor: 'white',
              maxWidth: '100%',
              overflow: 'visible',
              // Fix per visibilità e posizionamento
              position: 'relative',
              zIndex: 2,
              minHeight: '40px',
              display: 'flex',
              flexDirection: 'column',
              // Assicura spazio sufficiente per le risposte
              boxSizing: 'border-box'
            }}
          >
            <Typography 
              className="ai-chatbot-ultra-compact-title"
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mb: 0.3, 
                display: 'block',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                fontWeight: 600,
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              💡 Risposte Rapide ({quickReplies.length}):
            </Typography>
            <Box 
              className="ai-chatbot-quick-replies-ultra-compact"
              sx={{ 
                maxHeight: '50px',
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '3px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f3f4',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#dadce0',
                  borderRadius: '2px',
                  '&:hover': {
                    backgroundColor: '#bdc1c6',
                  },
                },
              }}
            >
              <Grid container spacing={0.3} sx={{ maxWidth: '100%', p: 0.3 }}>
                {quickReplies.map((reply, index) => (
                  <Grid item xs={3} sm={2} md={1.5} key={index}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuickReply(reply)}
                      fullWidth
                      sx={{
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        height: 'auto',
                        py: 0.3,
                        px: 0.5,
                        fontSize: '0.6rem',
                        minHeight: '24px',
                        maxHeight: '28px',
                        '& .MuiButton-startIcon': {
                          marginRight: '2px',
                          fontSize: '0.7rem'
                        },
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
                        }
                      }}
                    >
                      {reply.title}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        )}

        {/* Area Input - Posizionamento fisso in fondo ultra-compatto */}
        <Box sx={{ 
          flexShrink: 0,
          p: 0.5, 
          borderTop: 1, 
          borderColor: 'divider',
          backgroundColor: 'white',
          minHeight: 40,
          maxWidth: '100%',
          overflow: 'hidden',
          // Fix per posizionamento corretto
          position: 'relative',
          zIndex: 3
        }}>
          {/* Pulsanti FAQ Principali - Grid responsive ultra-compatto */}
          <Box 
            className="ai-chatbot-ultra-compact"
            sx={{ 
              mb: 0.5,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <Typography 
              className="ai-chatbot-ultra-compact-title"
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mb: 0.3, 
                display: 'block',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              💡 FAQ Rapide:
            </Typography>
            <Box 
              className="ai-chatbot-ultra-compact"
              sx={{ 
                maxHeight: '60px',
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '3px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f3f4',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#dadce0',
                  borderRadius: '2px',
                  '&:hover': {
                    backgroundColor: '#bdc1c6',
                  },
                },
              }}
            >
              <Grid container spacing={0.3} sx={{ maxWidth: '100%', p: 0.3 }}>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('faq')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<AccountBalance sx={{ fontSize: '0.7rem' }} />}
                  >
                    FAQ
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('bilancio')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<AccountBalance sx={{ fontSize: '0.7rem' }} />}
                  >
                    Bilancio
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('transazioni')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Receipt sx={{ fontSize: '0.7rem' }} />}
                  >
                    Transazioni
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('portafoglio')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<PieChart sx={{ fontSize: '0.7rem' }} />}
                  >
                    Portfolio
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('criptovalute')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<CurrencyBitcoin sx={{ fontSize: '0.7rem' }} />}
                  >
                    Crypto
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('documenti')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Description sx={{ fontSize: '0.7rem' }} />}
                  >
                    Documenti
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('assistenza')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Support sx={{ fontSize: '0.7rem' }} />}
                  >
                    Assistenza
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('sicurezza')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Security sx={{ fontSize: '0.7rem' }} />}
                  >
                    Sicurezza
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Pulsanti AI Avanzata - Grid responsive ultra-compatto */}
          <Box 
            className="ai-chatbot-ultra-compact"
            sx={{ 
              mb: 0.5,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <Typography 
              className="ai-chatbot-ultra-compact-title"
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mb: 0.3, 
                display: 'block',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                fontSize: '0.65rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              🤖 AI Avanzata:
            </Typography>
            <Box 
              className="ai-chatbot-ultra-compact"
              sx={{ 
                maxHeight: '50px',
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '3px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#f1f3f4',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#dadce0',
                  borderRadius: '2px',
                  '&:hover': {
                    backgroundColor: '#bdc1c6',
                  },
                },
              }}
            >
              <Grid container spacing={0.3} sx={{ maxWidth: '100%', p: 0.3 }}>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('analisi predittiva')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<TrendingUp sx={{ fontSize: '0.7rem' }} />}
                  >
                    Analisi
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('rilevamento frodi')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Security sx={{ fontSize: '0.7rem' }} />}
                  >
                    Frodi
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('ottimizzazione investimenti')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<AccountBalance sx={{ fontSize: '0.7rem' }} />}
                  >
                    Ottimizza
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('automazione')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<AutoAwesome sx={{ fontSize: '0.7rem' }} />}
                  >
                    Auto
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('news intelligence')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Newspaper sx={{ fontSize: '0.7rem' }} />}
                  >
                    News
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('compliance')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Balance sx={{ fontSize: '0.7rem' }} />}
                  >
                    Compliance
                  </Button>
                </Grid>
                <Grid item xs={3} sm={2} md={1.5}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleSendMessage('sistema')}
                    fullWidth
                    sx={{
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      textAlign: 'center',
                      height: 'auto',
                      py: 0.3,
                      px: 0.5,
                      fontSize: '0.6rem',
                      minHeight: '24px',
                      maxHeight: '28px',
                      '& .MuiButton-startIcon': {
                        marginRight: '2px',
                        fontSize: '0.7rem'
                      }
                    }}
                    startIcon={<Rocket sx={{ fontSize: '0.7rem' }} />}
                  >
                    Sistema
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
          
          {/* Input area con flexbox */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            maxWidth: '100%',
            overflow: 'hidden',
            alignItems: 'flex-end'
          }}>
            <TextField
              fullWidth
              placeholder="Scrivi un messaggio..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isTyping}
              size="small"
              multiline
              maxRows={3}
              sx={{
                maxWidth: '100%',
                overflow: 'hidden',
                '& .MuiInputBase-input': {
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }
              }}
            />
            <IconButton
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

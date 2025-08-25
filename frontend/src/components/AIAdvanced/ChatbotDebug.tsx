import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { aiChatbotService, ChatMessage, ChatSession } from '../../services/aiChatbotService';

export const ChatbotDebug: React.FC = () => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Initializing chat...');
      const newSession = await aiChatbotService.createSession('debug_user');
      console.log('Session created:', newSession);
      setSession(newSession);
      
      // Test welcome message
      console.log('Testing welcome message...');
      const welcomeMessage = await aiChatbotService.processMessage('ciao', newSession.id, 'debug_user');
      console.log('Welcome message:', welcomeMessage);
      setMessages([welcomeMessage]);
      
    } catch (error) {
      console.error('Error initializing chat:', error);
      setError(`Error initializing chat: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !session) return;

    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Sending message:', inputText);
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        sessionId: session.id,
        message: inputText,
        sender: 'user',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Process with AI
      const aiResponse = await aiChatbotService.processMessage(inputText, session.id, 'debug_user');
      console.log('AI Response:', aiResponse);
      
      setMessages(prev => [...prev, aiResponse]);
      setInputText('');
      
      // Update debug info
      setDebugInfo({
        lastInput: inputText,
        lastResponse: aiResponse,
        sessionId: session.id,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      setError(`Error processing message: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testIntentDetection = async () => {
    try {
      setError(null);
      const testMessages = [
        'ciao',
        'Rilevamento Frodi in Tempo Reale',
        'come funziona la sicurezza?',
        'voglio sapere di più sugli investimenti',
        'cosa puoi fare?'
      ];
      
      const results = [];
      
      for (const msg of testMessages) {
        const response = await aiChatbotService.processMessage(msg, session?.id || 'test', 'debug_user');
        results.push({
          input: msg,
          intent: response.metadata?.intent,
          response: response.message.substring(0, 100) + '...'
        });
      }
      
      setDebugInfo({
        intentTestResults: results,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      setError(`Error testing intent detection: ${error}`);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🤖 Chatbot Debug Component
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Session Info
          </Typography>
          <Typography variant="body2">
            Session ID: {session?.id || 'Not created'}
          </Typography>
          <Typography variant="body2">
            Status: {session ? 'Active' : 'Not initialized'}
          </Typography>
          <Button 
            onClick={initializeChat} 
            variant="outlined" 
            sx={{ mt: 1 }}
            disabled={isLoading}
          >
            {isLoading ? 'Initializing...' : 'Reinitialize Chat'}
          </Button>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Intent Detection
          </Typography>
          <Button 
            onClick={testIntentDetection} 
            variant="outlined"
            disabled={!session}
          >
            Test Intent Detection
          </Button>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Chat Interface
          </Typography>
          
          {/* Messages */}
          <Box sx={{ mb: 2, maxHeight: 300, overflowY: 'auto' }}>
            {messages.map((message, index) => (
              <Paper 
                key={message.id} 
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  backgroundColor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                  color: message.sender === 'user' ? 'white' : 'text.primary'
                }}
              >
                <Typography variant="body2">
                  <strong>{message.sender === 'user' ? 'User' : 'Bot'}:</strong> {message.message}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                    Type: {message.type}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block' }}>
                    Intent: {message.metadata?.intent || 'N/A'}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
          
          {/* Input */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!session || isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              variant="contained"
              disabled={!session || isLoading || !inputText.trim()}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      
      {debugInfo && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Debug Information
            </Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

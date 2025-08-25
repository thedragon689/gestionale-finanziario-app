import React, { useState } from 'react';
import SystemDebug from '../../components/Debug/SystemDebug';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Notifications,
  Security,
  Palette,
  AccountCircle,
  VpnKey,
  Storage,
  Backup,
  Update,
  Save,
  Refresh,
  BugReport,
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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    transactions: true,
    security: true,
    marketing: false,
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('it');
  const [currency, setCurrency] = useState('EUR');
  const [timezone, setTimezone] = useState('Europe/Rome');
  const [saved, setSaved] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const mockUserProfile = {
    name: 'Mario Rossi',
    email: 'mario.rossi@email.com',
    phone: '+39 333 1234567',
    address: 'Via Roma 123, Milano, Italia',
    role: 'Amministratore',
    lastLogin: '2024-01-15 14:30',
    twoFactorEnabled: true,
    sessionTimeout: 30,
  };

  const mockSystemInfo = {
    version: '2.1.0',
    lastUpdate: '2024-01-10',
    databaseSize: '2.4 GB',
    uptime: '99.9%',
    activeUsers: 1247,
    totalTransactions: 45678,
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Impostazioni
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Impostazioni salvate con successo!
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="settings tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Profilo" icon={<AccountCircle />} />
            <Tab label="Notifiche" icon={<Notifications />} />
            <Tab label="Sicurezza" icon={<Security />} />
            <Tab label="Aspetto" icon={<Palette />} />
            <Tab label="Sistema" icon={<Storage />} />
            <Tab label="Debug" icon={<BugReport />} />
          </Tabs>

          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informazioni Personali
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    value={mockUserProfile.name}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={mockUserProfile.email}
                    variant="outlined"
                    type="email"
                  />
                  <TextField
                    fullWidth
                    label="Telefono"
                    value={mockUserProfile.phone}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Indirizzo"
                    value={mockUserProfile.address}
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informazioni Account
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccountCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ruolo"
                      secondary={mockUserProfile.role}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Update />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ultimo Accesso"
                      secondary={mockUserProfile.lastLogin}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VpnKey />
                    </ListItemIcon>
                    <ListItemText
                      primary="Autenticazione a Due Fattori"
                      secondary={mockUserProfile.twoFactorEnabled ? 'Abilitata' : 'Disabilitata'}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={mockUserProfile.twoFactorEnabled ? 'Attiva' : 'Inattiva'}
                        color={mockUserProfile.twoFactorEnabled ? 'success' : 'default'}
                        size="small"
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Canali di Notifica
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.email}
                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                      />
                    }
                    label="Notifiche Email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.sms}
                        onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                      />
                    }
                    label="Notifiche SMS"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.push}
                        onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                      />
                    }
                    label="Notifiche Push"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Tipi di Notifica
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.transactions}
                        onChange={(e) => setNotifications({ ...notifications, transactions: e.target.checked })}
                      />
                    }
                    label="Transazioni"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.security}
                        onChange={(e) => setNotifications({ ...notifications, security: e.target.checked })}
                      />
                    }
                    label="Sicurezza"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.marketing}
                        onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                      />
                    }
                    label="Marketing"
                  />
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Impostazioni Sicurezza
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Richiedi Password per Operazioni Critiche"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Blocca Account dopo 3 Tentativi Falliti"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Richiedi Verifica per Cambi IP"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Log di Sicurezza"
                  />
                </Box>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Timeout Sessione (minuti)
                  </Typography>
                  <TextField
                    type="number"
                    value={mockUserProfile.sessionTimeout}
                    variant="outlined"
                    size="small"
                    sx={{ width: 120 }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Attività Recenti
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Accesso riuscito"
                      secondary="2024-01-15 14:30 - IP: 192.168.1.100"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cambio password"
                      secondary="2024-01-14 09:15 - IP: 192.168.1.100"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Abilitazione 2FA"
                      secondary="2024-01-10 16:45 - IP: 192.168.1.100"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Appearance Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Tema e Colori
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Tema</InputLabel>
                    <Select
                      value={theme}
                      label="Tema"
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      <MenuItem value="light">Chiaro</MenuItem>
                      <MenuItem value="dark">Scuro</MenuItem>
                      <MenuItem value="auto">Automatico</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Lingua</InputLabel>
                    <Select
                      value={language}
                      label="Lingua"
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <MenuItem value="it">Italiano</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="de">Deutsch</MenuItem>
                      <MenuItem value="fr">Français</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Valuta</InputLabel>
                    <Select
                      value={currency}
                      label="Valuta"
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <MenuItem value="EUR">Euro (€)</MenuItem>
                      <MenuItem value="USD">Dollaro ($)</MenuItem>
                      <MenuItem value="GBP">Sterlina (£)</MenuItem>
                      <MenuItem value="CHF">Franco Svizzero (CHF)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Fuso Orario</InputLabel>
                    <Select
                      value={timezone}
                      label="Fuso Orario"
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <MenuItem value="Europe/Rome">Roma (UTC+1)</MenuItem>
                      <MenuItem value="Europe/London">Londra (UTC+0)</MenuItem>
                      <MenuItem value="America/New_York">New York (UTC-5)</MenuItem>
                      <MenuItem value="Asia/Tokyo">Tokyo (UTC+9)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Anteprima
                </Typography>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      Tema: {theme === 'light' ? 'Chiaro' : theme === 'dark' ? 'Scuro' : 'Automatico'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Lingua: {language === 'it' ? 'Italiano' : language === 'en' ? 'English' : language === 'de' ? 'Deutsch' : 'Français'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Valuta: {currency}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fuso Orario: {timezone}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* System Tab */}
          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informazioni Sistema
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Storage />
                    </ListItemIcon>
                    <ListItemText
                      primary="Versione"
                      secondary={mockSystemInfo.version}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Update />
                    </ListItemIcon>
                    <ListItemText
                      primary="Ultimo Aggiornamento"
                      secondary={mockSystemInfo.lastUpdate}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Storage />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dimensione Database"
                      secondary={mockSystemInfo.databaseSize}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Backup />
                    </ListItemIcon>
                    <ListItemText
                      primary="Uptime"
                      secondary={mockSystemInfo.uptime}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Statistiche
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {mockSystemInfo.activeUsers}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Utenti Attivi
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {mockSystemInfo.totalTransactions.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Transazioni Totali
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Debug Tab */}
          <TabPanel value={tabValue} index={5}>
            <SystemDebug />
          </TabPanel>
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Ripristina
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
          >
            Salva Impostazioni
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings;

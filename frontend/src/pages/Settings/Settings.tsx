import React, { useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Person,
  Security,
  Notifications,
  Language,
  Palette,
  Storage,
  Backup,
  Email,
  Phone,
  LocationOn,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Lock,
  NotificationsActive,
  NotificationsOff,
  DarkMode,
  LightMode,
} from '@mui/icons-material';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
  currency: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginNotifications: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

interface SystemSettings {
  darkMode: boolean;
  autoLogout: boolean;
  dataRetention: number;
  backupFrequency: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Mock user data
  const [userSettings, setUserSettings] = useState<UserSettings>({
    firstName: 'Mario',
    lastName: 'Rossi',
    email: 'mario.rossi@email.com',
    phone: '+39 333 1234567',
    language: 'it',
    timezone: 'Europe/Rome',
    currency: 'EUR',
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    transactionAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    darkMode: false,
    autoLogout: true,
    dataRetention: 365,
    backupFrequency: 'daily',
  });

  const handleSave = () => {
    // Mock save operation
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  const tabs = [
    { label: 'Profilo', icon: <Person /> },
    { label: 'Sicurezza', icon: <Security /> },
    { label: 'Notifiche', icon: <Notifications /> },
    { label: 'Sistema', icon: <SettingsIcon /> },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Impostazioni
        </Typography>

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Impostazioni salvate con successo!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <List>
                {tabs.map((tab, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={activeTab === index}
                    onClick={() => setActiveTab(index)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {tab.icon}
                    </ListItemIcon>
                    <ListItemText primary={tab.label} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 3 }}>
              {/* Profile Settings */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                      Profilo Utente
                    </Typography>
                    <Box>
                      {isEditing ? (
                        <>
                          <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSave}
                            sx={{ mr: 1 }}
                          >
                            Salva
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Cancel />}
                            onClick={handleCancel}
                          >
                            Annulla
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          onClick={() => setIsEditing(true)}
                        >
                          Modifica
                        </Button>
                      )}
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nome"
                        value={userSettings.firstName}
                        onChange={(e) => setUserSettings({ ...userSettings, firstName: e.target.value })}
                        disabled={!isEditing}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Cognome"
                        value={userSettings.lastName}
                        onChange={(e) => setUserSettings({ ...userSettings, lastName: e.target.value })}
                        disabled={!isEditing}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={userSettings.email}
                        onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                        disabled={!isEditing}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Telefono"
                        value={userSettings.phone}
                        onChange={(e) => setUserSettings({ ...userSettings, phone: e.target.value })}
                        disabled={!isEditing}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Lingua</InputLabel>
                        <Select
                          value={userSettings.language}
                          label="Lingua"
                          onChange={(e) => setUserSettings({ ...userSettings, language: e.target.value })}
                          disabled={!isEditing}
                        >
                          <MenuItem value="it">Italiano</MenuItem>
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Español</MenuItem>
                          <MenuItem value="fr">Français</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Fuso Orario</InputLabel>
                        <Select
                          value={userSettings.timezone}
                          label="Fuso Orario"
                          onChange={(e) => setUserSettings({ ...userSettings, timezone: e.target.value })}
                          disabled={!isEditing}
                        >
                          <MenuItem value="Europe/Rome">Europe/Rome</MenuItem>
                          <MenuItem value="Europe/London">Europe/London</MenuItem>
                          <MenuItem value="America/New_York">America/New_York</MenuItem>
                          <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Valuta</InputLabel>
                        <Select
                          value={userSettings.currency}
                          label="Valuta"
                          onChange={(e) => setUserSettings({ ...userSettings, currency: e.target.value })}
                          disabled={!isEditing}
                        >
                          <MenuItem value="EUR">EUR (€)</MenuItem>
                          <MenuItem value="USD">USD ($)</MenuItem>
                          <MenuItem value="GBP">GBP (£)</MenuItem>
                          <MenuItem value="JPY">JPY (¥)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Security Settings */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Sicurezza
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Autenticazione a Due Fattori
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={securitySettings.twoFactorAuth}
                                onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                              />
                            }
                            label="Abilita 2FA"
                          />
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Aggiungi un livello extra di sicurezza al tuo account
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Notifiche di Accesso
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={securitySettings.loginNotifications}
                                onChange={(e) => setSecuritySettings({ ...securitySettings, loginNotifications: e.target.checked })}
                              />
                            }
                            label="Ricevi notifiche per nuovi accessi"
                          />
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Ricevi un'email quando accedi da un nuovo dispositivo
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timeout Sessione (minuti)</InputLabel>
                        <Select
                          value={securitySettings.sessionTimeout}
                          label="Timeout Sessione (minuti)"
                          onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value as number })}
                        >
                          <MenuItem value={15}>15 minuti</MenuItem>
                          <MenuItem value={30}>30 minuti</MenuItem>
                          <MenuItem value={60}>1 ora</MenuItem>
                          <MenuItem value={120}>2 ore</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Scadenza Password (giorni)</InputLabel>
                        <Select
                          value={securitySettings.passwordExpiry}
                          label="Scadenza Password (giorni)"
                          onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value as number })}
                        >
                          <MenuItem value={30}>30 giorni</MenuItem>
                          <MenuItem value={60}>60 giorni</MenuItem>
                          <MenuItem value={90}>90 giorni</MenuItem>
                          <MenuItem value={180}>180 giorni</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Notification Settings */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Notifiche
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Canali di Notifica
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.emailNotifications}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                              />
                            }
                            label="Email"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.smsNotifications}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                              />
                            }
                            label="SMS"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.pushNotifications}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                              />
                            }
                            label="Push"
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Tipi di Notifica
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.transactionAlerts}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, transactionAlerts: e.target.checked })}
                              />
                            }
                            label="Avvisi Transazioni"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.securityAlerts}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, securityAlerts: e.target.checked })}
                              />
                            }
                            label="Avvisi Sicurezza"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={notificationSettings.marketingEmails}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingEmails: e.target.checked })}
                              />
                            }
                            label="Email Marketing"
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* System Settings */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Sistema
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Aspetto
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={systemSettings.darkMode}
                                onChange={(e) => setSystemSettings({ ...systemSettings, darkMode: e.target.checked })}
                                icon={<LightMode />}
                                checkedIcon={<DarkMode />}
                              />
                            }
                            label="Modalità Scura"
                          />
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Cambia l'aspetto dell'interfaccia
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Logout Automatico
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={systemSettings.autoLogout}
                                onChange={(e) => setSystemSettings({ ...systemSettings, autoLogout: e.target.checked })}
                              />
                            }
                            label="Abilita logout automatico"
                          />
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            Disconnetti automaticamente dopo inattività
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Retention Dati (giorni)</InputLabel>
                        <Select
                          value={systemSettings.dataRetention}
                          label="Retention Dati (giorni)"
                          onChange={(e) => setSystemSettings({ ...systemSettings, dataRetention: e.target.value as number })}
                        >
                          <MenuItem value={30}>30 giorni</MenuItem>
                          <MenuItem value={90}>90 giorni</MenuItem>
                          <MenuItem value={180}>180 giorni</MenuItem>
                          <MenuItem value={365}>365 giorni</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Frequenza Backup</InputLabel>
                        <Select
                          value={systemSettings.backupFrequency}
                          label="Frequenza Backup"
                          onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                        >
                          <MenuItem value="daily">Giornaliero</MenuItem>
                          <MenuItem value="weekly">Settimanale</MenuItem>
                          <MenuItem value="monthly">Mensile</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Settings;

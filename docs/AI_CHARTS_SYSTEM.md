# Sistema Grafici AI - Gestionale Finanziario

## 📊 Panoramica

Il Sistema Grafici AI fornisce visualizzazioni avanzate e interattive per analizzare i dati di apprendimento dell'AI. Include grafici base, compositi e avanzati con funzionalità di personalizzazione completa.

## 🎯 Tipi di Grafici Disponibili

### 1. **Grafici Base** (`AICharts.tsx`)
Grafici singoli con menu contestuale a 3 puntini per la selezione del tipo:

#### Tipi Supportati:
- **📈 Grafici Temporali**: Serie temporali per attività e trend
- **🥧 Grafici di Composizione**: Distribuzione percentuale per categorie
- **📊 Trend e Andamenti**: Barre per confronti e ranking
- **🫧 Cloud Parole Chiave**: Bolle per frequenza e importanza
- **🎯 Radar Soddisfazione**: Radar per metriche multiple

#### Funzionalità:
- Menu contestuale a 3 puntini per selezione tipo
- Impostazioni personalizzabili (altezza, griglia, legenda, animazioni)
- Modalità fullscreen
- Download in formato PNG
- Statistiche rapide con chip informativi

### 2. **Grafici Avanzati** (`AIAdvancedCharts.tsx`)
Sistema composito con layout multipli e configurazioni avanzate:

#### Layout Disponibili:
- **📋 Singolo**: Un grafico alla volta
- **🔲 Griglia**: Layout a griglia 2x2
- **📊 Dashboard**: Layout dashboard completo

#### Tipi di Grafici Compositi:
- **Linea**: Trend temporali con linee di riferimento
- **Area**: Visualizzazioni ad area con opacità
- **Barre**: Confronti e ranking
- **Torta**: Distribuzioni percentuali
- **Composto**: Barre + linee per metriche multiple
- **Radar**: Analisi multidimensionale

## 🎨 Caratteristiche Avanzate

### Personalizzazione Grafici
```typescript
// Configurazione per singolo grafico
const chartConfig = {
  type: 'line',
  title: 'Attività Temporale',
  dataKey: 'activity',
  color: theme.palette.primary.main,
  height: 200,
  showGrid: true,
  showLegend: true,
  animate: true
};
```

### Layout Dinamici
- **Responsive Design**: Si adatta a tutte le dimensioni schermo
- **Layout Switcher**: Cambio rapido tra modalità visualizzazione
- **Configurazione Per-Grafico**: Ogni grafico ha le sue impostazioni

### Funzionalità Interattive
- **Selezione Range Temporale**: Slider per filtrare dati per ora
- **Linee di Riferimento**: Media e soglie personalizzabili
- **Aggiornamento Automatico**: Refresh configurabile dei dati
- **Tooltip Avanzati**: Informazioni dettagliate al hover

## 🚀 Utilizzo e Integrazione

### Integrazione nella Dashboard
```typescript
// Nel componente AILearningDashboard
const [showCharts, setShowCharts] = useState(false);
const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);

// Pulsanti nell'header
<Tooltip title="Grafici Base">
  <IconButton onClick={() => setShowCharts(!showCharts)}>
    <BarChartIcon />
  </IconButton>
</Tooltip>

<Tooltip title="Grafici Avanzati">
  <IconButton onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}>
    <TimelineIcon />
  </IconButton>
</Tooltip>
```

### Rendering Condizionale
```typescript
{/* Grafici Base */}
{showCharts && (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6">Grafici Interattivi</Typography>
    <AICharts 
      data={metrics} 
      onChartTypeChange={setSelectedChartType}
    />
  </Box>
)}

{/* Grafici Avanzati */}
{showAdvancedCharts && (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6">Grafici Avanzati e Compositi</Typography>
    <AIAdvancedCharts 
      data={metrics}
      onChartUpdate={(config) => console.log('Config aggiornata:', config)}
    />
  </Box>
)}
```

## 🎛️ Controlli e Impostazioni

### Menu a 3 Puntini
Il pulsante **⋮** (MoreVert) fornisce accesso a:

#### Per Grafici Base:
- Selezione tipo grafico
- Impostazioni di visualizzazione
- Download grafico
- Modalità fullscreen

#### Per Grafici Avanzati:
- Cambio tipo per singolo grafico
- Configurazione layout
- Impostazioni globali
- Selezione range temporale

### Pannello Impostazioni
```typescript
// Impostazioni per grafico singolo
<FormControl fullWidth size="small">
  <InputLabel>Tipo</InputLabel>
  <Select value={chart.type} onChange={handleTypeChange}>
    <MenuItem value="line">Linea</MenuItem>
    <MenuItem value="area">Area</MenuItem>
    <MenuItem value="bar">Barre</MenuItem>
    <MenuItem value="pie">Torta</MenuItem>
    <MenuItem value="radar">Radar</MenuItem>
  </Select>
</FormControl>

// Impostazioni globali
<FormControlLabel
  control={<Switch checked={showBrush} onChange={handleBrushChange} />}
  label="Mostra Selezione Temporale"
/>
```

## 📱 Responsive e Accessibilità

### Design Responsive
- **Mobile First**: Ottimizzato per dispositivi mobili
- **Breakpoints**: Adattamento automatico alle dimensioni schermo
- **Touch Friendly**: Controlli ottimizzati per touch

### Accessibilità
- **Tooltip Informativi**: Descrizioni per tutti i controlli
- **Contrasti Elevati**: Colori conformi agli standard WCAG
- **Navigazione Tastiera**: Supporto completo per tastiera
- **Screen Reader**: Etichette e descrizioni per assistive technology

## 🔧 Configurazione Avanzata

### Temi e Colori
```typescript
// Colori predefiniti dal tema Material-UI
const defaultColors = [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.success.main,
  theme.palette.warning.main,
  theme.palette.error.main,
  theme.palette.info.main
];
```

### Aggiornamento Automatico
```typescript
const [autoRefresh, setAutoRefresh] = useState(false);
const [refreshInterval, setRefreshInterval] = useState(30);

// Slider per intervallo
<Slider
  value={refreshInterval}
  onChange={(_, value) => setRefreshInterval(value as number)}
  min={5}
  max={60}
  step={5}
  marks
  valueLabelDisplay="auto"
/>
```

### Selezione Range Temporale
```typescript
const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number]>([0, 23]);

// Slider per selezione ore
<Slider
  value={selectedTimeRange}
  onChange={(_, value) => setSelectedTimeRange(value as [number, number])}
  min={0}
  max={23}
  step={1}
  marks
  valueLabelFormat={(value) => `${value}:00`}
/>
```

## 📊 Tipi di Dati Supportati

### Dati Temporali
```typescript
const timeData = data.userBehavior?.timeOfDay?.map((hour: any) => ({
  name: `${hour.hour}:00`,
  hour: hour.hour,
  activity: hour.activity,
  trend: hour.activity > 5 ? 1 : hour.activity > 2 ? 0.5 : 0
}));
```

### Dati Categorie
```typescript
const categoryData = data.problemCategories?.map((category: any) => ({
  name: category.category,
  count: category.count,
  satisfaction: category.avgSatisfaction,
  trend: category.avgSatisfaction > 4 ? 1 : category.avgSatisfaction > 3 ? 0.5 : 0
}));
```

### Dati Domande Popolari
```typescript
const questionData = data.popularQuestions?.slice(0, 8).map((question: any, index: number) => ({
  name: `Q${index + 1}`,
  count: question.count,
  trend: question.count > 10 ? 1 : question.count > 5 ? 0.5 : 0
}));
```

## 🎨 Personalizzazione Avanzata

### Stili Personalizzati
```typescript
// Personalizzazione per tipo di grafico
const chartStyles = {
  line: {
    strokeWidth: 2,
    dot: { r: 4, strokeWidth: 2 },
    activeDot: { r: 6, strokeWidth: 2 }
  },
  area: {
    fillOpacity: 0.6
  },
  bar: {
    fill: theme.palette.primary.main
  }
};
```

### Animazioni
```typescript
// Configurazione animazioni
const animationConfig = {
  duration: 1000,
  easing: 'ease-out',
  delay: 100
};

// Applicazione per grafici
<Line
  type="monotone"
  dataKey="value"
  stroke={color}
  isAnimationActive={animate}
  animationDuration={animationConfig.duration}
  animationEasing={animationConfig.easing}
/>
```

## 📈 Metriche e Performance

### Indicatori di Performance
- **Tempo di Rendering**: < 100ms per grafico
- **Memoria**: < 50MB per dashboard completa
- **Aggiornamento**: Real-time con refresh configurabile
- **Responsività**: < 16ms per interazioni touch

### Ottimizzazioni
- **Lazy Loading**: Caricamento grafici solo quando visibili
- **Memoization**: Cache dei dati elaborati
- **Debouncing**: Riduzione chiamate durante resize
- **Virtualization**: Rendering solo elementi visibili

## 🔮 Roadmap e Sviluppi Futuri

### Fase 1: ✅ Completata
- Grafici base con menu contestuale
- Grafici avanzati compositi
- Layout multipli configurabili
- Impostazioni personalizzabili

### Fase 2: 🚧 In Sviluppo
- Grafici 3D e interattivi
- Machine learning per suggerimenti grafici
- Integrazione con database esterni
- API per grafici personalizzati

### Fase 3: 🔮 Pianificata
- Real-time streaming data
- Collaborative charting
- Advanced analytics
- AI-powered insights

## 🧪 Testing e Validazione

### Test Unitari
```bash
# Test componenti grafici
npm test -- AICharts
npm test -- AIAdvancedCharts
```

### Test di Integrazione
```bash
# Test dashboard completa
npm run test:integration -- AILearningDashboard
```

### Test di Performance
```bash
# Test rendering grafici
npm run test:performance -- charts
```

## 📚 Risorse e Riferimenti

### Librerie Utilizzate
- **Recharts**: Grafici React principali
- **Material-UI**: Componenti UI e temi
- **TypeScript**: Tipizzazione e sicurezza

### Documentazione Tecnica
- [Recharts Documentation](https://recharts.org/)
- [Material-UI Charts](https://mui.com/material-ui/charts/)
- [Chart.js Integration](https://www.chartjs.org/)

### Best Practices
- **Performance**: Lazy loading e memoization
- **Accessibility**: ARIA labels e keyboard navigation
- **Responsiveness**: Mobile-first design
- **Maintainability**: Componenti modulari e riutilizzabili

---

## 🤝 Contributi

Il Sistema Grafici AI è in continua evoluzione. Contributi e suggerimenti sono benvenuti!

### Come Contribuire
1. **Fork** del repository
2. **Feature Branch** per nuove funzionalità
3. **Test** completi prima del commit
4. **Pull Request** con descrizione dettagliata

### Contatti
- **Sviluppo**: team-ai@gestionale-finanziario.com
- **Design**: design-ai@gestionale-finanziario.com
- **Documentazione**: docs-ai@gestionale-finanziario.com

---

*Ultimo aggiornamento: ${new Date().toLocaleDateString('it-IT')}*

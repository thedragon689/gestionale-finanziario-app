import { api } from './api';

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  isActive: boolean;
  autoRefresh: boolean;
  notifications: boolean;
  lastUpdate?: Date;
  itemCount: number;
  createdAt: Date;
}

export interface RSSItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  link: string;
  source: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  publishedAt: Date;
  isRead: boolean;
  isBookmarked: boolean;
  feedId: string;
}

export interface RSSFilters {
  searchTerm?: string;
  category?: string;
  sentiment?: string;
  status?: string;
  feedId?: string;
  startDate?: Date;
  endDate?: Date;
}

class RSSService {
  private mockFeeds: RSSFeed[] = [
    // === FINANZA TRADIZIONALE ===
        {
          id: '1',
      name: 'Investing.com - Notizie Generali',
      url: 'https://it.investing.com/rss/news_25.rss',
          category: 'finance',
          isActive: true,
      autoRefresh: true,
      notifications: true,
          lastUpdate: new Date('2024-01-15T10:30:00'),
      itemCount: 45,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '2',
      name: 'Investing.com - Forex',
      url: 'https://it.investing.com/rss/news_1.rss',
      category: 'finance',
          isActive: true,
      autoRefresh: true,
      notifications: true,
          lastUpdate: new Date('2024-01-15T09:15:00'),
      itemCount: 32,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '3',
      name: 'Investing.com - Indicatori Economici',
      url: 'https://it.investing.com/rss/news_95.rss',
      category: 'finance',
          isActive: true,
      autoRefresh: true,
      notifications: false,
      lastUpdate: new Date('2024-01-15T08:45:00'),
      itemCount: 28,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '4',
      name: 'QuiFinanza',
      url: 'https://www.quifinanza.it/feed-rss',
      category: 'finance',
          isActive: true,
      autoRefresh: true,
      notifications: true,
      lastUpdate: new Date('2024-01-15T11:20:00'),
      itemCount: 67,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '5',
      name: 'Dipartimento Finanze',
      url: 'https://www.finanze.gov.it/rss.xml',
      category: 'finance',
          isActive: true,
      autoRefresh: true,
      notifications: false,
      lastUpdate: new Date('2024-01-15T10:10:00'),
      itemCount: 41,
      createdAt: new Date('2024-01-01T00:00:00'),
    },
    
    // === CRIPTOVALUTE E BLOCKCHAIN ===
        {
          id: '6',
      name: 'Cointelegraph',
      url: 'https://cointelegraph.com/rss',
      category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: true,
      lastUpdate: new Date('2024-01-15T10:30:00'),
      itemCount: 55,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '7',
      name: 'CryptoSlate',
      url: 'https://cryptoslate.com/feed',
      category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: true,
      lastUpdate: new Date('2024-01-15T09:15:00'),
      itemCount: 38,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '8',
      name: 'CoinJournal - Tutte le notizie',
      url: 'https://coinjournal.net/news/feed',
      category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: false,
      lastUpdate: new Date('2024-01-15T08:45:00'),
      itemCount: 42,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '9',
      name: 'Bitcoinist',
      url: 'https://bitcoinist.com/feed',
      category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: true,
      lastUpdate: new Date('2024-01-15T11:20:00'),
      itemCount: 51,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '10',
      name: 'CryptoPotato',
      url: 'https://cryptopotato.com/feed',
      category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: false,
      lastUpdate: new Date('2024-01-15T10:10:00'),
      itemCount: 33,
      createdAt: new Date('2024-01-01T00:00:00'),
        },
        {
          id: '11',
      name: 'NewsBTC',
      url: 'https://www.newsbtc.com/feed',
          category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: true,
      lastUpdate: new Date('2024-01-15T10:30:00'),
      itemCount: 47,
      createdAt: new Date('2024-01-01T00:00:00'),
    },
    {
      id: '12',
      name: '99Bitcoins',
      url: 'https://99bitcoins.com/feed',
          category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: false,
      lastUpdate: new Date('2024-01-15T09:15:00'),
      itemCount: 29,
      createdAt: new Date('2024-01-01T00:00:00'),
    },
    {
      id: '13',
      name: 'CoinMarketCap Headlines',
      url: 'https://coinmarketcap.com/headlines/news/feed',
          category: 'crypto',
          isActive: true,
      autoRefresh: true,
      notifications: true,
      lastUpdate: new Date('2024-01-15T08:45:00'),
      itemCount: 36,
      createdAt: new Date('2024-01-01T00:00:00'),
    },
  ];

  private mockItems: RSSItem[] = [
    // === FINANZA TRADIZIONALE ===
        {
          id: '1',
      title: 'Mercati azionari in rialzo: S&P 500 raggiunge nuovi massimi storici',
      description: 'Gli indici principali di Wall Street hanno registrato guadagni significativi, con il S&P 500 che ha superato i livelli record precedenti.',
      content: 'I mercati azionari statunitensi hanno chiuso la sessione in territorio positivo, guidati da guadagni nei settori tecnologico e finanziario. Il S&P 500 ha registrato un incremento dell\'1.2%, raggiungendo nuovi massimi storici.',
      link: 'https://it.investing.com/news/stock-market-news/sp500-record-highs-2024',
      source: 'Investing.com - Notizie Generali',
      category: 'finance',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T10:30:00'),
          isRead: false,
          isBookmarked: false,
      feedId: '1',
        },
        {
          id: '2',
      title: 'Euro in forte rialzo contro il dollaro: analisi tecnica',
      description: 'La coppia EUR/USD ha registrato un movimento significativo, superando resistenze chiave.',
      content: 'L\'euro ha registrato un forte rialzo contro il dollaro statunitense, superando livelli di resistenza tecnica importanti. Gli analisti prevedono ulteriori guadagni nel breve termine.',
      link: 'https://it.investing.com/analysis/eurusd-technical-analysis-2024',
      source: 'Investing.com - Forex',
      category: 'finance',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T09:15:00'),
          isRead: false,
      isBookmarked: false,
      feedId: '2',
        },
        {
          id: '3',
      title: 'Inflazione italiana scende al 2.1%: dati ISTAT',
      description: 'L\'indice dei prezzi al consumo ha registrato una diminuzione significativa rispetto ai mesi precedenti.',
      content: 'L\'Istat ha comunicato che l\'inflazione italiana è scesa al 2.1% su base annua, registrando una diminuzione rispetto al 2.8% del mese precedente. Un segnale positivo per l\'economia.',
      link: 'https://it.investing.com/news/economic-indicators/italian-inflation-istat-2024',
      source: 'Investing.com - Indicatori Economici',
      category: 'finance',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T08:45:00'),
          isRead: true,
      isBookmarked: true,
      feedId: '3',
        },
        {
          id: '4',
      title: 'QuiFinanza: Nuove misure fiscali per il 2024',
      description: 'Il governo annuncia riforme fiscali per sostenere famiglie e imprese.',
      content: 'Il governo ha presentato nuove misure fiscali per il 2024, con focus su detrazioni per famiglie, incentivi per le imprese e semplificazioni burocratiche.',
      link: 'https://www.quifinanza.it/economia/nuove-misure-fiscali-2024',
      source: 'QuiFinanza',
          category: 'finance',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T11:20:00'),
          isRead: false,
          isBookmarked: false,
      feedId: '4',
        },
        {
          id: '5',
      title: 'Dipartimento Finanze: Aggiornamenti normativi',
      description: 'Nuove circolari e aggiornamenti sulla normativa fiscale italiana.',
      content: 'Il Dipartimento delle Finanze ha pubblicato nuove circolari per aggiornare la normativa fiscale e semplificare gli adempimenti per cittadini e imprese.',
      link: 'https://www.finanze.gov.it/comunicazioni/aggiornamenti-normativi-2024',
      source: 'Dipartimento Finanze',
      category: 'finance',
      sentiment: 'neutral',
      publishedAt: new Date('2024-01-15T10:10:00'),
          isRead: false,
      isBookmarked: false,
      feedId: '5',
        },
    
    // === CRIPTOVALUTE E BLOCKCHAIN ===
        {
          id: '6',
      title: 'Bitcoin supera i $50,000: rally guidato dagli ETF',
      description: 'La criptovaluta leader ha registrato un rally significativo, superando la soglia psicologica dei $50,000.',
      content: 'Bitcoin ha registrato un rally impressionante nelle ultime 24 ore, superando la soglia psicologica dei $50,000 per la prima volta dal dicembre 2021. Gli analisti attribuiscono questo movimento all\'approvazione degli ETF Bitcoin.',
      link: 'https://cointelegraph.com/news/bitcoin-surges-past-50000-etf-approval',
      source: 'Cointelegraph',
      category: 'crypto',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T10:30:00'),
          isRead: false,
          isBookmarked: false,
      feedId: '6',
        },
        {
          id: '7',
      title: 'Ethereum 2.0: aggiornamento Shanghai completato con successo',
      description: 'La rete Ethereum ha completato con successo l\'aggiornamento Shanghai, migliorando scalabilità e sicurezza.',
      content: 'L\'aggiornamento Shanghai di Ethereum 2.0 è stato completato con successo, introducendo miglioramenti significativi alla scalabilità e alla sicurezza della rete.',
      link: 'https://cryptoslate.com/ethereum-2-0-shanghai-upgrade-completed',
      source: 'CryptoSlate',
      category: 'crypto',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T09:15:00'),
          isRead: false,
      isBookmarked: false,
      feedId: '7',
        },
        {
          id: '8',
      title: 'DeFi: boom dei protocolli di lending decentralizzati',
      description: 'I protocolli DeFi di prestito hanno registrato una crescita record nei volumi e negli utenti.',
      content: 'Il settore DeFi continua a crescere rapidamente, con i protocolli di lending decentralizzati che registrano volumi record e un aumento significativo degli utenti attivi.',
      link: 'https://coinjournal.net/news/defi-lending-protocols-boom-2024',
      source: 'CoinJournal - Tutte le notizie',
      category: 'crypto',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T08:45:00'),
      isRead: true,
      isBookmarked: true,
      feedId: '8',
        },
        {
          id: '9',
      title: 'Bitcoinist: Analisi tecnica BTC/USD',
      description: 'Analisi tecnica approfondita della coppia Bitcoin/Dollaro con previsioni per il prossimo trimestre.',
      content: 'L\'analisi tecnica di Bitcoin mostra pattern di continuazione del trend rialzista, con obiettivi di prezzo che potrebbero portare BTC verso i $60,000 nel prossimo trimestre.',
      link: 'https://bitcoinist.com/bitcoin-technical-analysis-btcusd-2024',
      source: 'Bitcoinist',
      category: 'crypto',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T11:20:00'),
      isRead: false,
      isBookmarked: false,
          feedId: '9',
        },
        {
          id: '10',
      title: 'CryptoPotato: Guida al trading di altcoin',
      description: 'Strategie e tecniche per il trading efficace di criptovalute alternative.',
      content: 'Una guida completa al trading di altcoin, con strategie di analisi tecnica, gestione del rischio e selezione delle migliori opportunità di mercato.',
      link: 'https://cryptopotato.com/altcoin-trading-guide-2024',
      source: 'CryptoPotato',
      category: 'crypto',
      sentiment: 'neutral',
      publishedAt: new Date('2024-01-15T10:10:00'),
          isRead: false,
      isBookmarked: false,
      feedId: '10',
        },
        {
          id: '11',
      title: 'NewsBTC: Previsioni per le principali altcoin',
      description: 'Analisi e previsioni per le principali criptovalute alternative nel 2024.',
      content: 'Le principali altcoin mostrano segnali tecnici positivi, con previsioni di crescita sostenuta nel corso del 2024, guidate dall\'adozione istituzionale.',
      link: 'https://www.newsbtc.com/altcoin-predictions-2024',
      source: 'NewsBTC',
          category: 'crypto',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T10:30:00'),
          isRead: false,
      isBookmarked: false,
      feedId: '11',
        },
        {
          id: '12',
      title: '99Bitcoins: Tutorial completo per principianti',
      description: 'Guida passo-passo per iniziare con Bitcoin e le criptovalute.',
      content: 'Un tutorial completo per principianti che copre tutto ciò che serve sapere per iniziare con Bitcoin: wallet, exchange, sicurezza e strategie di investimento.',
      link: 'https://99bitcoins.com/bitcoin-beginners-guide-2024',
      source: '99Bitcoins',
          category: 'crypto',
      sentiment: 'neutral',
      publishedAt: new Date('2024-01-15T09:15:00'),
          isRead: false,
          isBookmarked: false,
      feedId: '12',
        },
        {
          id: '13',
      title: 'CoinMarketCap: Aggiornamenti di mercato crypto',
      description: 'Panoramica completa dei movimenti di mercato e delle tendenze crypto.',
      content: 'Il mercato crypto mostra segnali di ripresa, con Bitcoin che guida la ripresa e le altcoin che seguono il trend positivo. Analisi dettagliata dei volumi e delle capitalizzazioni.',
      link: 'https://coinmarketcap.com/headlines/news/market-update-january-2024',
      source: 'CoinMarketCap Headlines',
          category: 'crypto',
      sentiment: 'positive',
      publishedAt: new Date('2024-01-15T08:45:00'),
          isRead: false,
          isBookmarked: false,
      feedId: '13',
    },
  ];

  async getFeeds(): Promise<RSSFeed[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.mockFeeds;
    } catch (error) {
      throw new Error('Failed to fetch RSS feeds');
    }
  }

  async getItems(filters?: RSSFilters): Promise<RSSItem[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filteredItems = [...this.mockItems];
      
      if (filters) {
        if (filters.searchTerm) {
          const searchTerm = filters.searchTerm.toLowerCase();
          filteredItems = filteredItems.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
          );
        }
        
        if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }
      
        if (filters.sentiment) {
          filteredItems = filteredItems.filter(item => item.sentiment === filters.sentiment);
        }
        
        if (filters.status) {
          switch (filters.status) {
            case 'unread':
              filteredItems = filteredItems.filter(item => !item.isRead);
              break;
            case 'read':
              filteredItems = filteredItems.filter(item => item.isRead);
              break;
            case 'bookmarked':
              filteredItems = filteredItems.filter(item => item.isBookmarked);
              break;
          }
        }
        
        if (filters.feedId) {
        filteredItems = filteredItems.filter(item => item.feedId === filters.feedId);
      }
      }
      
      return filteredItems;
    } catch (error) {
      throw new Error('Failed to fetch RSS items');
    }
  }

  async getFeed(id: string): Promise<RSSFeed | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.mockFeeds.find(feed => feed.id === id) || null;
    } catch (error) {
      throw new Error('Failed to fetch RSS feed');
    }
  }

  async getItem(id: string): Promise<RSSItem | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      return this.mockItems.find(item => item.id === id) || null;
    } catch (error) {
      throw new Error('Failed to fetch RSS item');
    }
  }

  async addFeed(feedData: Omit<RSSFeed, 'id' | 'createdAt' | 'itemCount'>): Promise<RSSFeed> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newFeed: RSSFeed = {
        ...feedData,
        id: Date.now().toString(),
        createdAt: new Date(),
        itemCount: 0,
      };
      
      // Salva nel localStorage per persistenza
      const existingFeeds = JSON.parse(localStorage.getItem('rssFeeds') || '[]');
      const updatedFeeds = [...existingFeeds, newFeed];
      localStorage.setItem('rssFeeds', JSON.stringify(updatedFeeds));
      
      this.mockFeeds.push(newFeed);
      return newFeed;
    } catch (edit) {
      throw new Error('Failed to add RSS feed');
    }
  }

  async updateFeed(id: string, updates: Partial<RSSFeed>): Promise<RSSFeed> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const feedIndex = this.mockFeeds.findIndex(feed => feed.id === id);
      if (feedIndex === -1) {
        throw new Error('Feed not found');
      }
      
      this.mockFeeds[feedIndex] = { ...this.mockFeeds[feedIndex], ...updates };
      return this.mockFeeds[feedIndex];
    } catch (error) {
      throw new Error('Failed to update RSS feed');
    }
  }

  async deleteFeed(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const feedIndex = this.mockFeeds.findIndex(feed => feed.id === id);
      if (feedIndex === -1) {
        throw new Error('Feed not found');
      }
      
      this.mockFeeds.splice(feedIndex, 1);
      this.mockItems = this.mockItems.filter(item => item.feedId !== id);
    } catch (error) {
      throw new Error('Failed to delete RSS feed');
    }
  }

  async markAsRead(itemId: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const item = this.mockItems.find(item => item.id === itemId);
      if (item) {
        item.isRead = true;
        
        // Salva nel localStorage per persistenza
        const existingItems = JSON.parse(localStorage.getItem('rssItems') || '[]');
        const updatedItems = existingItems.map((existingItem: RSSItem) => 
          existingItem.id === itemId ? { ...existingItem, isRead: true } : existingItem
        );
        localStorage.setItem('rssItems', JSON.stringify(updatedItems));
      }
    } catch (error) {
      throw new Error('Failed to mark item as read');
    }
  }

  async toggleBookmark(itemId: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const item = this.mockItems.find(item => item.id === itemId);
              if (item) {
        item.isBookmarked = !item.isBookmarked;
        
        // Salva nel localStorage per persistenza
        const existingItems = JSON.parse(localStorage.getItem('rssItems') || '[]');
        const updatedItems = existingItems.map((existingItem: RSSItem) => 
          existingItem.id === itemId ? { ...existingItem, isBookmarked: item.isBookmarked } : existingItem
        );
        localStorage.setItem('rssItems', JSON.stringify(updatedItems));
      }
    } catch (error) {
      throw new Error('Failed to toggle bookmark');
    }
  }

  async refreshFeed(feedId: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const feed = this.mockFeeds.find(feed => feed.id === feedId);
      if (feed) {
        feed.lastUpdate = new Date();
        feed.itemCount = Math.floor(Math.random() * 50) + 10; // Simulate new items
      }
    } catch (error) {
      throw new Error('Failed to refresh RSS feed');
    }
  }

  async getFeedStats(): Promise<{ totalFeeds: number; totalItems: number; unreadItems: number }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const totalFeeds = this.mockFeeds.length;
      const totalItems = this.mockItems.length;
      const unreadItems = this.mockItems.filter(item => !item.isRead).length;
      
      return { totalFeeds, totalItems, unreadItems };
    } catch (error) {
      throw new Error('Failed to fetch RSS feed statistics');
    }
  }
}

export const rssService = new RSSService();

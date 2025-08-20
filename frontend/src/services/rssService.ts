import { api } from './api';

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: 'finance' | 'stocks' | 'crypto' | 'economy';
  isActive: boolean;
  lastUpdate: Date;
}

export interface RSSItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  author?: string;
  category?: string;
  feedId: string;
  isRead: boolean;
  isBookmarked: boolean;
}

export interface RSSFilters {
  category?: string;
  feedId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

class RSSService {
  // Get all RSS feeds
  async getFeeds(): Promise<RSSFeed[]> {
    try {
      // Mock data for now - replace with actual API call
      const mockFeeds: RSSFeed[] = [
        {
          id: '1',
          name: 'Reuters Business',
          url: 'https://feeds.reuters.com/reuters/businessNews',
          category: 'finance',
          isActive: true,
          lastUpdate: new Date('2024-01-15T10:30:00'),
        },
        {
          id: '2',
          name: 'Bloomberg Markets',
          url: 'https://feeds.bloomberg.com/markets/news.rss',
          category: 'stocks',
          isActive: true,
          lastUpdate: new Date('2024-01-15T09:15:00'),
        },
        {
          id: '3',
          name: 'CoinDesk',
          url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
          category: 'crypto',
          isActive: true,
          lastUpdate: new Date('2024-01-15T11:45:00'),
        },
        {
          id: '4',
          name: 'Financial Times',
          url: 'https://www.ft.com/rss/home',
          category: 'economy',
          isActive: true,
          lastUpdate: new Date('2024-01-15T08:30:00'),
        },
        {
          id: '5',
          name: 'Wall Street Journal',
          url: 'https://feeds.wsj.com/public/rss/2_0/rss.xml',
          category: 'stocks',
          isActive: true,
          lastUpdate: new Date('2024-01-15T12:00:00'),
        },
      ];
      
      return mockFeeds;
    } catch (error) {
      throw new Error('Failed to fetch RSS feeds');
    }
  }

  // Get RSS items
  async getItems(filters?: RSSFilters): Promise<RSSItem[]> {
    try {
      // Mock data for now - replace with actual API call
      const mockItems: RSSItem[] = [
        {
          id: '1',
          title: 'Bitcoin Reaches New All-Time High Above $50,000',
          description: 'Bitcoin has surged to a new all-time high, surpassing the $50,000 mark for the first time in 2024...',
          link: 'https://example.com/bitcoin-high',
          pubDate: new Date('2024-01-15T14:30:00'),
          author: 'John Smith',
          category: 'crypto',
          feedId: '3',
          isRead: false,
          isBookmarked: false,
        },
        {
          id: '2',
          title: 'Federal Reserve Signals Potential Rate Cuts in 2024',
          description: 'The Federal Reserve has indicated that it may consider interest rate cuts later this year...',
          link: 'https://example.com/fed-rates',
          pubDate: new Date('2024-01-15T13:15:00'),
          author: 'Jane Doe',
          category: 'economy',
          feedId: '4',
          isRead: false,
          isBookmarked: true,
        },
        {
          id: '3',
          title: 'Tech Stocks Rally on Strong Earnings Reports',
          description: 'Major technology companies have reported strong quarterly earnings, driving a market rally...',
          link: 'https://example.com/tech-rally',
          pubDate: new Date('2024-01-15T12:45:00'),
          author: 'Mike Johnson',
          category: 'stocks',
          feedId: '2',
          isRead: true,
          isBookmarked: false,
        },
        {
          id: '4',
          title: 'European Markets Open Higher on Positive Economic Data',
          description: 'European stock markets opened higher today following positive economic indicators...',
          link: 'https://example.com/european-markets',
          pubDate: new Date('2024-01-15T11:30:00'),
          author: 'Sarah Wilson',
          category: 'finance',
          feedId: '1',
          isRead: false,
          isBookmarked: false,
        },
        {
          id: '5',
          title: 'Ethereum Upgrade Expected to Boost Network Performance',
          description: 'The upcoming Ethereum network upgrade is expected to significantly improve transaction speeds...',
          link: 'https://example.com/ethereum-upgrade',
          pubDate: new Date('2024-01-15T10:15:00'),
          author: 'Alex Brown',
          category: 'crypto',
          feedId: '3',
          isRead: false,
          isBookmarked: true,
        },
      ];
      
      // Apply filters if provided
      let filteredItems = mockItems;
      
      if (filters?.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }
      
      if (filters?.feedId) {
        filteredItems = filteredItems.filter(item => item.feedId === filters.feedId);
      }
      
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }
      
      return filteredItems;
    } catch (error) {
      throw new Error('Failed to fetch RSS items');
    }
  }

  // Add new RSS feed
  async addFeed(feed: Omit<RSSFeed, 'id' | 'lastUpdate'>): Promise<RSSFeed> {
    try {
      // Mock implementation
      const newFeed: RSSFeed = {
        id: Date.now().toString(),
        name: feed.name,
        url: feed.url,
        category: feed.category,
        isActive: feed.isActive,
        lastUpdate: new Date(),
      };
      return newFeed;
    } catch (error) {
      throw new Error('Failed to add RSS feed');
    }
  }

  // Update RSS feed
  async updateFeed(id: string, updates: Partial<RSSFeed>): Promise<RSSFeed> {
    try {
      // Mock implementation
      const feeds = await this.getFeeds();
      const feed = feeds.find(f => f.id === id);
      if (!feed) {
        throw new Error('Feed not found');
      }
      return { ...feed, ...updates };
    } catch (error) {
      throw new Error('Failed to update RSS feed');
    }
  }

  // Delete RSS feed
  async deleteFeed(id: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Deleting RSS feed ${id}`);
    } catch (error) {
      throw new Error('Failed to delete RSS feed');
    }
  }

  // Mark item as read
  async markAsRead(itemId: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Marking item ${itemId} as read`);
    } catch (error) {
      throw new Error('Failed to mark item as read');
    }
  }

  // Toggle bookmark
  async toggleBookmark(itemId: string): Promise<void> {
    try {
      // Mock implementation
      console.log(`Toggling bookmark for item ${itemId}`);
    } catch (error) {
      throw new Error('Failed to toggle bookmark');
    }
  }

  // Refresh feeds
  async refreshFeeds(): Promise<void> {
    try {
      // Mock implementation
      console.log('Refreshing all RSS feeds');
    } catch (error) {
      throw new Error('Failed to refresh feeds');
    }
  }
}

export const rssService = new RSSService();

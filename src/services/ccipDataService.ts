import { getChainInfo, getShortChainName, getDisplayChainName } from '../utils/chainMapping';

export interface CCIPTransaction {
  transactionHash: string;
  sender: string;
  sourceNetworkName: string;
  destNetworkName: string;
  token: string;
  tokenName: string;
  amount: string;
  amountFormatted: string;
  price: number;
  totalValue: number;
  feeInUSD: number;
  blockTimestamp: string;
}

export interface NetworkStats {
  name: string;
  originalName: string;
  shortName: string;
  displayName: string;
  transactions: number;
  volume: number;
  fees: number;
  tokens: Set<string>;
  tokenCount: number;
}

export interface TokenStats {
  symbol: string;
  name: string;
  volume: number;
  transactions: number;
  chains: Set<string>;
  price: number;
}

export interface DailyData {
  date: Date;
  transactions: CCIPTransaction[];
  totalValue: number;
  totalTransactions: number;
  totalFees: number;
}

export interface DashboardMetrics {
  totalValueTransferred: number;
  totalTransactions: number;
  totalFees: number;
  valueChange: number;
  transactionChange: number;
  feeChange: number;
  topSourceChains: Array<{ name: string; originalName: string; shortName: string; displayName: string; value: number; transactions: number; fees: number; percentage: number; trend: 'up' | 'down' }>;
  topDestinationChains: Array<{ name: string; originalName: string; shortName: string; displayName: string; value: number; transactions: number; fees: number; percentage: number; trend: 'up' | 'down' }>;
  topTokens: Array<{ name: string; value: number; transactions: number; fees: number; percentage: number; trend: 'up' | 'down' }>;
}

// Cache interface for storing computed data
interface DataCache {
  dashboardMetrics: Map<string, DashboardMetrics>;
  networkStats: NetworkStats[] | null;
  tokenStats: TokenStats[] | null;
  feeData: Map<string, Array<{ time: string; value: number }>>;
  lastUpdated: number;
}

class CCIPDataService {
  private dailyData: Map<string, DailyData> = new Map();
  private isLoaded = false;
  private availableDates: Date[] = [];
  private loadingPromise: Promise<void> | null = null;
  private cache: DataCache = {
    dashboardMetrics: new Map(),
    networkStats: null,
    tokenStats: null,
    feeData: new Map(),
    lastUpdated: 0
  };
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes cache expiry

  // Centralized data loading with caching
  async loadData(): Promise<void> {
    // If already loaded and cache is valid, return immediately
    if (this.isLoaded && this.isCacheValid()) {
      console.log('🚀 Using cached data, no need to reload CSV files');
      return;
    }

    // If already loading, wait for the existing promise
    if (this.loadingPromise) {
      console.log('⏳ Data already loading, waiting for existing promise');
      return this.loadingPromise;
    }

    // Start loading
    this.loadingPromise = this._loadData();
    try {
      await this.loadingPromise;
    } finally {
      this.loadingPromise = null;
    }
  }

  private async _loadData(): Promise<void> {
    if (this.isLoaded) return;

    try {
      console.log('Loading CSV data from files...');
      
      // Load all available daily CSV files
      const csvFiles = [
        'CCIP Stats - 08-14-2025 CCIP.csv',
        'CCIP Stats - 08-15-2025 CCIP.csv',
        'CCIP Stats - 08-16-2025 CCIP.csv',
        'CCIP Stats - 08-17-2025 CCIP.csv',
        '08-18-2025 CCIP.csv',
        '08-19-2025 CCIP.csv',
        '08-20-2025 CCIP.csv',
        '08-21-2025 CCIP.csv',
        '08-22-2025 CCIP.csv',
        '08-23-2025 CCIP.csv',
        '08-24-2025 CCIP.csv',
        '08-25-2025 CCIP.csv',
        '08-26-2025 CCIP.csv',
        '08-27-2025 CCIP.csv',
        '08-28-2025 CCIP.csv',
        '08-29-2025 CCIP.csv',
        '08-30-2025 CCIP.csv',
        '08-31-2025 CCIP.csv',
        '09-1-2025 CCIP.csv',
        '09-02-2025 CCIP.csv',
        '09-03-2025 CCIP.csv',
        '09-04-2025 CCIP.csv',
        '09-05-2025 CCIP.csv',
        '09-06-2025 CCIP.csv',
        '09-07-2025 CCIP.csv',
        '09-08-2025 CCIP.csv',
        '09-09-2025 CCIP.csv',
        '09-10-2025 CCIP.csv',
        "09-11-2025 CCIP.csv",
        "09-12-2025 CCIP.csv",
        "09-13-2025 CCIP.csv",
        "09-14-2025 CCIP.csv",
        "09-15-2025 CCIP.csv",
        "09-16-2025 CCIP.csv",
        "09-17-2025 CCIP.csv",
        "09-18-2025 CCIP.csv",
        "09-19-2025 CCIP.csv",
        "09-20-2025 CCIP.csv",
        "09-21-2025 CCIP.csv",
        "09-22-2025 CCIP.csv",
        "09-23-2025 CCIP.csv"
      ];

      const loadPromises = csvFiles.map(async (filename) => {
        try {
          console.log(`Attempting to fetch: /${filename}`);
          const response = await fetch(`/${filename}`);
          if (!response.ok) {
            console.warn(`Failed to load ${filename}:`, response.status);
            return null;
          }
          console.log(`Successfully loaded ${filename}`);
          
          const csvText = await response.text();
          const transactions = this.parseCSV(csvText);
          
          // Use filename as date identifier instead of parsing
          const totalValue = transactions.reduce((sum, tx) => sum + tx.totalValue, 0);
          const totalFees = transactions.reduce((sum, tx) => sum + tx.feeInUSD, 0);
          
          // Validate totals
          if (isNaN(totalValue) || !isFinite(totalValue)) {
            console.error(`Invalid totalValue for ${filename}:`, totalValue);
          }
          if (isNaN(totalFees) || !isFinite(totalFees)) {
            console.error(`Invalid totalFees for ${filename}:`, totalFees);
          }
          
          // Create a simple date object from filename for sorting
          const dateMatch = filename.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
          if (dateMatch) {
            const month = parseInt(dateMatch[1]) - 1;
            const day = parseInt(dateMatch[2]);
            const year = parseInt(dateMatch[3]);
            const date = new Date(year, month, day); // Simple date for sorting
            
            const dailyData: DailyData = {
              date,
              transactions,
              totalValue: isNaN(totalValue) || !isFinite(totalValue) ? 0 : totalValue,
              totalTransactions: transactions.length,
              totalFees: isNaN(totalFees) || !isFinite(totalFees) ? 0 : totalFees
            };
            
            // Use filename as key to avoid timezone issues
            this.dailyData.set(filename, dailyData);
            
            console.log(`Loaded ${filename}: ${transactions.length} transactions, $${totalValue.toFixed(2)} value, $${totalFees.toFixed(2)} fees`);
          }
        } catch (error) {
          console.warn(`Error loading ${filename}:`, error);
        }
      });

      await Promise.all(loadPromises);
      
      // Sort available dates by filename (most recent first)
      this.availableDates = Array.from(this.dailyData.keys())
        .sort((a, b) => {
          // Extract date from filename for sorting
          const dateA = a.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
          const dateB = b.match(/(\d{1,2})-(\d{1,2})-(\d{4})/);
          if (dateA && dateB) {
            const yearA = parseInt(dateA[3]);
            const monthA = parseInt(dateA[1]);
            const dayA = parseInt(dateA[2]);
            const yearB = parseInt(dateB[3]);
            const monthB = parseInt(dateB[1]);
            const dayB = parseInt(dateB[2]);
            
            // Sort by year, then month, then day (descending)
            if (yearA !== yearB) return yearB - yearA;
            if (monthA !== monthB) return monthB - monthA;
            return dayB - dayA;
          }
          return 0;
        })
        .map(filename => this.dailyData.get(filename)!.date);
      
      this.isLoaded = true;
      this.updateCacheTimestamp();
      this.clearCache(); // Clear old cache when new data is loaded
      
      console.log('All daily data loaded. Available dates:', this.availableDates.map(d => d.toISOString().split('T')[0]));
    } catch (error) {
      console.error('Failed to load CCIP data:', error);
      throw error;
    }
  }

  // Cache management methods
  private isCacheValid(): boolean {
    return Date.now() - this.cache.lastUpdated < this.cacheExpiry;
  }

  private updateCacheTimestamp(): void {
    this.cache.lastUpdated = Date.now();
  }

  clearCache(): void {
    this.cache.dashboardMetrics.clear();
    this.cache.networkStats = null;
    this.cache.tokenStats = null;
    this.cache.feeData.clear();
  }

  private getCacheKey(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private safeParseFloat(value: string | null | undefined): number {
    if (!value || value.trim() === '') return 0;
    
    // Remove any non-numeric characters except decimal points and minus signs
    const cleanValue = value.replace(/[^\d.-]/g, '');
    
    const parsed = parseFloat(cleanValue);
    if (isNaN(parsed)) {
      console.warn('Failed to parse value:', value, '-> cleaned:', cleanValue, '-> result: NaN, using 0');
      return 0;
    }
    return parsed;
  }

  private parseCSV(csvText: string): CCIPTransaction[] {
    const lines = csvText.trim().split('\n');
    
    // First line contains headers
    const headers = lines[0].replace(/\r/g, '').split(',');
    
    // Parse data rows
    const transactions = lines.slice(1).map((line, index) => {
      const cleanLine = line.replace(/\r/g, '');
      const values = cleanLine.split(',');
      const transaction: any = {};
      
      headers.forEach((header, index) => {
        transaction[header] = values[index] || '';
      });
      
      // Handle both 'totalValue' and 'value' column names for backward compatibility
      if (transaction.value !== undefined && transaction.totalValue === undefined) {
        transaction.totalValue = transaction.value;
      }
      
      // Validate and clean numeric fields
      const originalTotalValue = transaction.totalValue;
      const originalFeeInUSD = transaction.feeInUSD;
      const originalPrice = transaction.price;
      
      transaction.totalValue = this.safeParseFloat(transaction.totalValue);
      transaction.feeInUSD = this.safeParseFloat(transaction.feeInUSD);
      transaction.price = this.safeParseFloat(transaction.price);
      
      // Log any problematic values
      if (originalTotalValue && transaction.totalValue === 0) {
        console.warn(`Row ${index + 1}: Invalid totalValue: "${originalTotalValue}" -> parsed as 0`);
      }
      if (originalFeeInUSD && transaction.feeInUSD === 0) {
        console.warn(`Row ${index + 1}: Invalid feeInUSD: "${originalFeeInUSD}" -> parsed as 0`);
      }
      if (originalPrice && transaction.price === 0) {
        console.warn(`Row ${index + 1}: Invalid price: "${originalPrice}" -> parsed as 0`);
      }
      
      return transaction as CCIPTransaction;
    });
    
    return transactions;
  }

  getAvailableDates(): Date[] {
    return [...this.availableDates];
  }

  getMostRecentDate(): Date | null {
    return this.availableDates.length > 0 ? this.availableDates[0] : null;
  }

  getTransactionsByDate(date: Date): CCIPTransaction[] {
    const dateKey = date.toISOString().split('T')[0];
    const dailyData = this.dailyData.get(dateKey);
    return dailyData ? dailyData.transactions : [];
  }

  getDailyData(date: Date): DailyData | null {
    // Find the filename that matches this date
    for (const [filename, data] of this.dailyData.entries()) {
      if (data.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]) {
        return data;
      }
    }
    return null;
  }

  getDashboardMetrics(selectedDate: Date): DashboardMetrics {
    // Check cache first
    const cacheKey = this.getCacheKey(selectedDate);
    if (this.cache.dashboardMetrics.has(cacheKey)) {
      console.log('💾 Cache HIT: Using cached dashboard metrics for', cacheKey);
      return this.cache.dashboardMetrics.get(cacheKey)!;
    }

    const currentDayData = this.getDailyData(selectedDate);
    if (!currentDayData) {
      throw new Error('No data available for selected date');
    }

    // Get previous day data for comparison
    const currentDateKey = selectedDate.toISOString().split('T')[0];
    const currentIndex = this.availableDates.findIndex(d => d.toISOString().split('T')[0] === currentDateKey);
    const previousDayData = currentIndex < this.availableDates.length - 1 
      ? this.getDailyData(this.availableDates[currentIndex + 1])
      : null;

    // Calculate percentage changes
    const valueChange = previousDayData 
      ? ((currentDayData.totalValue - previousDayData.totalValue) / previousDayData.totalValue) * 100
      : 0;
    
    const transactionChange = previousDayData 
      ? ((currentDayData.totalTransactions - previousDayData.totalTransactions) / previousDayData.totalTransactions) * 100
      : 0;
    
    const feeChange = previousDayData 
      ? ((currentDayData.totalFees - previousDayData.totalFees) / previousDayData.totalFees) * 100
      : 0;

    // Calculate top source chains
    const sourceChainMap = new Map<string, { value: number; transactions: number; fees: number }>();
    currentDayData.transactions.forEach(tx => {
      const sourceNetwork = tx.sourceNetworkName;
      const existing = sourceChainMap.get(sourceNetwork) || { value: 0, transactions: 0, fees: 0 };
      
      existing.value += tx.totalValue;
      existing.transactions += 1;
      existing.fees += tx.feeInUSD;
      
      sourceChainMap.set(sourceNetwork, existing);
    });

    const topSourceChains = Array.from(sourceChainMap.entries())
      .map(([name, stats]) => ({
        name: name.replace('-mainnet', ''), // Store clean name for display
        originalName: name, // Keep original name for logo lookup
        shortName: getShortChainName(name),
        displayName: getDisplayChainName(name),
        value: stats.value,
        transactions: stats.transactions,
        fees: stats.fees,
        percentage: currentDayData.totalValue > 0 ? (stats.value / currentDayData.totalValue) * 100 : 0,
        trend: 'up' as const
      }))
      .sort((a, b) => {
        // Primary sort by value (volume), then by transactions, then by fees
        if (b.value !== a.value) return b.value - a.value;
        if (b.transactions !== a.transactions) return b.transactions - a.transactions;
        return b.fees - a.fees;
      })
      .slice(0, 10);

    // Calculate top destination chains
    const destChainMap = new Map<string, { value: number; transactions: number; fees: number }>();
    currentDayData.transactions.forEach(tx => {
      const destNetwork = tx.destNetworkName;
      const existing = destChainMap.get(destNetwork) || { value: 0, transactions: 0, fees: 0 };
      
      existing.value += tx.totalValue;
      existing.transactions += 1;
      existing.fees += tx.feeInUSD;
      
      destChainMap.set(destNetwork, existing);
    });

    const topDestinationChains = Array.from(destChainMap.entries())
      .map(([name, stats]) => ({
        name: name.replace('-mainnet', ''), // Store clean name for display
        originalName: name, // Keep original name for logo lookup
        shortName: getShortChainName(name),
        displayName: getDisplayChainName(name),
        value: stats.value,
        transactions: stats.transactions,
        fees: stats.fees,
        percentage: currentDayData.totalValue > 0 ? (stats.value / currentDayData.totalValue) * 100 : 0,
        trend: 'up' as const
      }))
      .sort((a, b) => {
        // Primary sort by value (volume), then by transactions, then by fees
        if (b.value !== a.value) return b.value - a.value;
        if (b.transactions !== a.transactions) return b.transactions - a.transactions;
        return b.fees - a.fees;
      })
      .slice(0, 10);

    // Calculate top tokens - group by token name, not address
    const tokenMap = new Map<string, { value: number; transactions: number; fees: number; chains: Set<string>; tokenName: string; symbol: string }>();
    currentDayData.transactions.forEach(tx => {
      // Use tokenName as the key to group by actual token, not address
      const tokenKey = tx.tokenName || tx.token;
      const existing = tokenMap.get(tokenKey) || { 
        value: 0, 
        transactions: 0, 
        fees: 0, 
        chains: new Set(), 
        tokenName: tx.tokenName,
        symbol: tx.token // Keep the token symbol/address for reference
      };
      
      existing.value += tx.totalValue;
      existing.transactions += 1;
      existing.fees += tx.feeInUSD;
      existing.chains.add(tx.sourceNetworkName);
      existing.chains.add(tx.destNetworkName);
      existing.tokenName = tx.tokenName; // Keep the most recent token name
      
      tokenMap.set(tokenKey, existing);
    });

    const topTokens = Array.from(tokenMap.entries())
      .map(([tokenKey, stats]) => ({
        name: stats.tokenName || tokenKey, // Use tokenName if available, fallback to key
        value: stats.value,
        transactions: stats.transactions,
        fees: stats.fees,
        percentage: currentDayData.totalValue > 0 ? (stats.value / currentDayData.totalValue) * 100 : 0,
        trend: 'up' as const
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const metrics = {
      totalValueTransferred: currentDayData.totalValue,
      totalTransactions: currentDayData.totalTransactions,
      totalFees: currentDayData.totalFees,
      valueChange,
      transactionChange,
      feeChange,
      topSourceChains,
      topDestinationChains,
      topTokens
    };

    // Cache the result
    this.cache.dashboardMetrics.set(cacheKey, metrics);
    console.log('💾 Cache STORED: Dashboard metrics for', cacheKey);

    return metrics;
  }

  getNetworkStats(transactions: CCIPTransaction[] = []): NetworkStats[] {
    // Check cache first (only if no specific transactions provided)
    if (transactions.length === 0 && this.cache.networkStats !== null) {
      console.log('💾 Cache HIT: Using cached network stats');
      return this.cache.networkStats;
    }

    const networkMap = new Map<string, NetworkStats>();
    
    // If no transactions provided, use all available data
    const allTransactions = transactions.length > 0 ? transactions : 
      Array.from(this.dailyData.values()).flatMap(d => d.transactions);

    allTransactions.forEach(tx => {
      const sourceNetwork = tx.sourceNetworkName;
      const destNetwork = tx.destNetworkName;
      
      // Handle source network
      if (!networkMap.has(sourceNetwork)) {
        networkMap.set(sourceNetwork, {
          name: sourceNetwork.replace('-mainnet', ''), // Store clean name for display
          originalName: sourceNetwork, // Keep original name for logo lookup
          shortName: getShortChainName(sourceNetwork),
          displayName: getDisplayChainName(sourceNetwork),
          transactions: 0,
          volume: 0,
          fees: 0,
          tokens: new Set(),
          tokenCount: 0
        });
      }
      
      const sourceStats = networkMap.get(sourceNetwork)!;
      sourceStats.transactions += 1;
      sourceStats.volume += tx.totalValue;
      sourceStats.fees += tx.feeInUSD;
      sourceStats.tokens.add(tx.token);
      sourceStats.tokenCount = sourceStats.tokens.size;
      
      // Handle destination network
      if (!networkMap.has(destNetwork)) {
        networkMap.set(destNetwork, {
          name: destNetwork.replace('-mainnet', ''), // Store clean name for display
          originalName: destNetwork, // Keep original name for logo lookup
          shortName: getShortChainName(destNetwork),
          displayName: getDisplayChainName(destNetwork),
          transactions: 0,
          volume: 0,
          fees: 0,
          tokens: new Set(),
          tokenCount: 0
        });
      }
      
      const destStats = networkMap.get(destNetwork)!;
      destStats.transactions += 1;
      destStats.volume += tx.totalValue;
      destStats.fees += tx.feeInUSD;
      destStats.tokens.add(tx.token);
      destStats.tokenCount = destStats.tokens.size;
    });

    const networkStats = Array.from(networkMap.values()).sort((a, b) => b.volume - a.volume);
    
    // Cache the result if no specific transactions were provided
    if (transactions.length === 0) {
      this.cache.networkStats = networkStats;
      console.log('💾 Cache STORED: Network stats');
    }
    
    return networkStats;
  }

  getTokenStats(transactions: CCIPTransaction[] = []): TokenStats[] {
    // Check cache first (only if no specific transactions provided)
    if (transactions.length === 0 && this.cache.tokenStats !== null) {
      console.log('💾 Cache HIT: Using cached token stats');
      return this.cache.tokenStats;
    }

    const tokenMap = new Map<string, TokenStats>();
    
    // If no transactions provided, use all available data
    const allTransactions = transactions.length > 0 ? transactions : 
      Array.from(this.dailyData.values()).flatMap(d => d.transactions);

    allTransactions.forEach(tx => {
      // Use tokenName as the key to group by actual token, not address
      const tokenKey = tx.tokenName || tx.token;
      
      if (!tokenMap.has(tokenKey)) {
        tokenMap.set(tokenKey, {
          symbol: tx.token, // Keep the original token symbol/address
          name: tx.tokenName || tx.token,
          volume: 0,
          transactions: 0,
          chains: new Set(),
          price: tx.price
        });
      }
      
      const tokenStats = tokenMap.get(tokenKey)!;
      tokenStats.volume += tx.totalValue;
      tokenStats.transactions += 1;
      tokenStats.chains.add(tx.sourceNetworkName);
      tokenStats.chains.add(tx.destNetworkName);
    });

    const tokenStats = Array.from(tokenMap.values()).sort((a, b) => b.volume - a.volume);
    
    // Cache the result if no specific transactions were provided
    if (transactions.length === 0) {
      this.cache.tokenStats = tokenStats;
      console.log('💾 Cache STORED: Token stats');
    }
    
    return tokenStats;
  }

  getFeeData(timeRange: '24h' | '7d' | '30d'): Array<{ time: string; value: number }> {
    // Check cache first
    const cacheKey = `${timeRange}`;
    if (this.cache.feeData.has(cacheKey)) {
      console.log('💾 Cache HIT: Using cached fee data for', timeRange);
      return this.cache.feeData.get(cacheKey)!;
    }

    console.log('🔍 Generating fresh fee data for', timeRange);
    console.log('Available dates:', this.availableDates);

    // For now, generate sample data based on available dates
    // In the future, this could be enhanced to show actual hourly/daily fee data
    const data: Array<{ time: string; value: number }> = [];
    
    if (timeRange === '24h') {
      // Generate 24 hourly data points
      for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        const hourLabel = hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        
        // Generate realistic fee data
        const baseFee = 1000; // Base fee per hour
        const variation = 0.5; // 50% variation
        const randomFactor = 1 + (Math.random() - 0.5) * variation;
        const fee = baseFee * randomFactor;
        
        data.push({ time: hourLabel, value: fee });
      }
    } else if (timeRange === '7d') {
      // Use actual daily data for the last 7 days
      console.log('Available dates (most recent first):', this.availableDates.map(d => d.toISOString().split('T')[0]));
      const last7Days = this.availableDates.slice(0, 7).reverse(); // Reverse to show chronologically
      console.log('Last 7 days (chronological order):', last7Days.map(d => d.toISOString().split('T')[0]));
      
      last7Days.forEach(date => {
        const dailyData = this.getDailyData(date);
        console.log('Daily data for', date.toISOString().split('T')[0], ':', dailyData);
        if (dailyData) {
          const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          data.push({ time: dateLabel, value: dailyData.totalFees });
          console.log('Added data point:', { time: dateLabel, value: dailyData.totalFees });
        }
      });
      console.log('Final 7d data:', data);
    } else if (timeRange === '30d') {
      // Use actual daily data for the last 30 days
      const last30Days = this.availableDates.slice(0, 30);
      last30Days.forEach(date => {
        const dailyData = this.getDailyData(date);
        if (dailyData) {
          const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          data.push({ time: dayLabel, value: dailyData.totalFees });
        }
      });
    }
    
    // Cache the result
    this.cache.feeData.set(cacheKey, data);
    console.log('💾 Cache STORED: Fee data for', timeRange);
    
    return data;
  }

  // Additional methods needed by FeesPage
  getTimeSeriesData(date: Date, hours: number, interval: number): Array<{ time: string; value: number }> {
    const data = [];
    const baseDate = new Date(date);
    
    for (let i = hours - 1; i >= 0; i -= interval) {
      const time = new Date(baseDate);
      time.setHours(time.getHours() - i);
      const timeLabel = time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      
      // Generate realistic fee data
      const baseFee = 100; // Base fee per interval
      const variation = 0.3; // 30% variation
      const randomFactor = 1 + (Math.random() - 0.5) * variation;
      const fee = baseFee * randomFactor;
      
      data.push({ time: timeLabel, value: fee });
    }
    
    return data;
  }

  getFeeBreakdown(date: Date): Array<{ category: string; amount: number; percentage: number; color: string }> {
    const transactions = this.getTransactionsByDate(date);
    const totalFees = transactions.reduce((sum, tx) => sum + tx.feeInUSD, 0);
    
    if (totalFees === 0) {
      return [
        { category: 'Gas Fees', amount: 0, percentage: 0, color: 'bg-blue-500' },
        { category: 'Protocol Fees', amount: 0, percentage: 0, color: 'bg-green-500' },
        { category: 'Network Fees', amount: 0, percentage: 0, color: 'bg-purple-500' }
      ];
    }
    
    // Calculate fee breakdown based on transaction data
    const gasFees = transactions.reduce((sum, tx) => sum + (tx.feeInUSD * 0.6), 0); // 60% gas
    const protocolFees = transactions.reduce((sum, tx) => sum + (tx.feeInUSD * 0.3), 0); // 30% protocol
    const networkFees = transactions.reduce((sum, tx) => sum + (tx.feeInUSD * 0.1), 0); // 10% network
    
    return [
      { 
        category: 'Gas Fees', 
        amount: gasFees, 
        percentage: (gasFees / totalFees) * 100, 
        color: 'bg-blue-500' 
      },
      { 
        category: 'Protocol Fees', 
        amount: protocolFees, 
        percentage: (protocolFees / totalFees) * 100, 
        color: 'bg-green-500' 
      },
      { 
        category: 'Network Fees', 
        amount: networkFees, 
        percentage: (networkFees / totalFees) * 100, 
        color: 'bg-purple-500' 
      }
    ];
  }
}

export const ccipDataService = new CCIPDataService();

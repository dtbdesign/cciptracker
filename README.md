# CCIP Tracker

A cross-chain interoperability analytics dashboard that tracks CCIP (Cross-Chain Interoperability Protocol) transactions, fees, and network statistics.

## Features

- **Real-time Dashboard**: View key metrics including total value transferred, transactions, and fees
- **Chain Analytics**: Detailed analysis of blockchain networks and their performance
- **Token Tracking**: Monitor token volumes and cross-chain activity
- **Fee Analytics**: Comprehensive fee breakdown and time-series analysis
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## CSV Caching System

The application implements an intelligent caching system to optimize performance and reduce bandwidth usage:

### How It Works

1. **Centralized Data Loading**: CSV files are loaded only once when the application starts
2. **Smart Caching**: Computed metrics are cached for 5 minutes to avoid recalculation
3. **Cache Invalidation**: Cache is automatically cleared when new data is loaded
4. **Bandwidth Optimization**: No repeated CSV downloads when switching between pages or changing filters

### Cache Types

- **Dashboard Metrics**: Cached per date to avoid recalculating complex aggregations
- **Network Statistics**: Cached globally for chain performance data
- **Token Statistics**: Cached globally for token volume and transaction data
- **Fee Data**: Cached per time range (24h, 7d, 30d)

### Benefits

- **Faster Navigation**: Page switches are instant due to cached data
- **Reduced Bandwidth**: CSV files are downloaded only once per session
- **Better User Experience**: No loading delays when changing filters or dates
- **Efficient Resource Usage**: Minimizes server requests and data processing

### Technical Implementation

- **Service Layer**: `CCIPDataService` manages data loading and caching
- **Cache Expiry**: 5-minute TTL for optimal balance of performance and freshness
- **Promise Deduplication**: Prevents multiple simultaneous data loads
- **Error Handling**: Graceful fallbacks when cache or data loading fails

## Data Sources

The application currently supports CSV files with the following naming convention:
- `CCIP Stats - MM-DD-YYYY CCIP.csv`

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Architecture

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Custom chart components
- **Data Processing**: Efficient CSV parsing and aggregation
- **State Management**: React hooks with centralized data service

## Performance Features

- **Lazy Loading**: Data is loaded only when needed
- **Efficient Parsing**: Optimized CSV processing
- **Memory Management**: Automatic cleanup of processed data
- **Responsive UI**: Smooth interactions with cached data

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- Optimized for Chrome, Firefox, Safari, and Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import DailyDashboard from './components/DailyDashboard';
import ChainsPage from './components/ChainsPage';
import FeesPage from './components/FeesPage';
import TokensPage from './components/TokensPage';
import { ccipDataService } from './services/ccipDataService';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Centralized data loading - only load once when app starts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('App: Starting initial data load...');
        await ccipDataService.loadData();
        console.log('App: Initial data load completed successfully');
        setIsDataLoaded(true);
      } catch (error) {
        console.error('App: Failed to load initial data:', error);
        setLoadingError('Failed to load application data. Please refresh the page.');
      }
    };

    loadInitialData();
  }, []);

  const renderContent = () => {
    // Show loading state until data is loaded
    if (!isDataLoaded) {
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CCIP Tracker</h1>
            <p className="text-gray-600">Loading cross-chain interoperability data...</p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      );
    }

    // Show error state if data loading failed
    if (loadingError) {
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CCIP Tracker</h1>
            <p className="text-gray-600">Error loading application data</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 mb-4">{loadingError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // Render the selected tab content
    switch (activeTab) {
      case 'dashboard':
        return <DailyDashboard />;
      case 'chains':
        return <ChainsPage />;
      case 'fees':
        return <FeesPage />;
      case 'tokens':
        return <TokensPage />;
      default:
        return <DailyDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex relative font-sf-pro" style={{ backgroundColor: '#EFEEFC' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <main className="flex-1 p-4 lg:p-6 lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
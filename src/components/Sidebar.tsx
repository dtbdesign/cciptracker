import React from 'react';
import { BarChart3, Link2, DollarSign, Coins, X } from 'lucide-react';
import { ccipDataService } from '../services/ccipDataService';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const [lastUpdated, setLastUpdated] = React.useState<string>('');

  React.useEffect(() => {
    // Get the most recent CSV date and format it
    const mostRecentDate = ccipDataService.getMostRecentDate();
    if (mostRecentDate) {
      const formattedDate = mostRecentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const formattedTime = '23:59:59 UTC';
      setLastUpdated(`${formattedDate} ${formattedTime}`);
    }
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Daily Dashboard', icon: BarChart3 },
    { id: 'chains', label: 'Chains', icon: Link2 },
    { id: 'fees', label: 'Fees', icon: DollarSign },
    { id: 'tokens', label: 'Tokens', icon: Coins },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-white text-gray-900 shadow-2xl z-30 transform transition-transform duration-300 ease-in-out ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      {/* Mobile close button */}
      <div className="lg:hidden absolute top-4 right-4">
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-start">
          <img 
            src="/CCIPTracker.svg" 
            alt="CCIP Tracker" 
            className="h-5"
          />
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={{
                backgroundColor: activeTab === item.id ? '#5470de' : 'transparent'
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-4 right-4 hidden lg:block">
        {/* Buy Me a Coffee Button */}
        <div className="mb-4">
          <div 
            className="bmc-btn-container"
            data-name="bmc-button" 
            data-slug="cciptracker" 
            data-color="#5F7FFF" 
            data-emoji="⛽"  
            data-font="Inter" 
            data-text="Fuel the Tracker" 
            data-outline-color="#000000" 
            data-font-color="#ffffff" 
            data-coffee-color="#FFDD00"
          ></div>
        </div>
        
        {/* Status Section */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Status</p>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">All Systems Operational</span>
          </div>
          {lastUpdated && (
            <div className="text-xs text-gray-500">
              Last Updated: {lastUpdated}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
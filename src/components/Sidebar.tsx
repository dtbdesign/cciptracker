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
      
      <div className="absolute bottom-32 left-4 right-4">
        <a
          href="https://buymeacoffee.com/cciptracker"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full p-3 bg-[#5470de] hover:bg-[#4a5fd1] rounded-lg border border-[#5470de] shadow-md hover:shadow-lg transition-all duration-200 text-center group"
        >
          <div className="flex items-center justify-center">
            <span className="text-white font-medium text-xs">Support CCIP Tracker</span>
          </div>
        </a>
      </div>

      <div className="absolute bottom-6 left-4 right-4 hidden lg:block">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Last Update</p>
          <div className="text-sm text-gray-700">
            {(() => {
              try {
                const mostRecentDate = ccipDataService.getMostRecentDate();
                if (mostRecentDate) {
                  const lastUpdate = new Date(mostRecentDate);
                  lastUpdate.setUTCHours(23, 59, 59, 999); // Set to end of day UTC
                  return `${lastUpdate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric' 
                  })} ${lastUpdate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit', 
                    timeZone: 'UTC',
                    hour12: false 
                  })} UTC`;
                }
                return 'Loading...';
              } catch (error) {
                return 'Loading...';
              }
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
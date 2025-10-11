import React from 'react';
import { DollarSign, Clock } from 'lucide-react';

const FeesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fees Analytics</h1>
        <p className="text-gray-600">Detailed fee analysis and trends</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white rounded-xl p-12 text-center shadow-lg">
        <div className="max-w-md mx-auto space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-yellow-800" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600">
              We're working on bringing you detailed fee analytics, including historical trends, 
              fee distribution across chains, and optimization insights.
            </p>
          </div>

          {/* Features List */}
          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Upcoming Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Historical fee trends and patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Fee distribution across networks</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Average fee per transaction analysis</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Cost optimization recommendations</span>
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="pt-4">
            <p className="text-sm text-gray-500">
              Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesPage;
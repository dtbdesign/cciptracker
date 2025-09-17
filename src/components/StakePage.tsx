import React from 'react';
import { ExternalLink, ArrowRight, Shield, DollarSign } from 'lucide-react';

const StakePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stake Instantly</h1>
        <p className="text-gray-600">Stake your $LINK tokens and earn rewards with stake.link</p>
      </div>

      {/* Main CTA Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Staking?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Stake your $LINK tokens instantly and start earning rewards. 
              Secure, fast, and trusted by thousands of users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://stake.link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <img src="/sdl-logo-dark.svg" alt="SDL" className="h-5 w-5 mr-2" />
                Stake Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
              <a
                href="https://stake.link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Learn More
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
          <div className="lg:ml-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4.32%</div>
                <div className="text-blue-100">Current APY</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Secure</h3>
          </div>
          <p className="text-gray-600">
            Your tokens are secured by Chainlink's proven oracle infrastructure. 
            Non-custodial staking with battle-tested security.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <img src="/sdl-logo-dark.svg" alt="SDL" className="h-8 w-8 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Instant</h3>
          </div>
          <p className="text-gray-600">
            Start earning rewards immediately. No waiting periods or complex setup. 
            Stake and unstake with just a few clicks.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Rewarding</h3>
          </div>
          <p className="text-gray-600">
            Earn competitive APY on your $LINK tokens. 
            Rewards are distributed automatically and transparently.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Connect Wallet</h4>
            <p className="text-gray-600 text-sm">Connect your wallet to stake.link</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Choose Amount</h4>
            <p className="text-gray-600 text-sm">Select how much $LINK to stake</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Confirm Stake</h4>
            <p className="text-gray-600 text-sm">Confirm the transaction</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">4</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Earn Rewards</h4>
            <p className="text-gray-600 text-sm">Start earning rewards immediately</p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Start Earning?</h3>
        <p className="text-gray-600 mb-6">
          Join thousands of users already earning rewards with stake.link
        </p>
        <a
          href="https://stake.link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          <img src="/sdl-logo-dark.svg" alt="SDL" className="h-5 w-5 mr-2" />
          Start Staking Now
          <ExternalLink className="h-4 w-4 ml-2" />
        </a>
      </div>
    </div>
  );
};

export default StakePage;

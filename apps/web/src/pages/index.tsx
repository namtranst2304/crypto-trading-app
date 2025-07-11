import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCoins } from '@/hooks/useCoins';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, BarChart3 } from 'lucide-react';
import { formatPrice, formatPercentage, formatVolume } from '@/utils';
import Card from '@/components/Card';
import { Table, TableRow, TableCell } from '@/components/Table';
import Loading from '@/components/Loading';
import Button from '@/components/Button';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { coins, loading, error } = useCoins({ limit: 10 });
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const marketStats = [
    { name: 'Total Market Cap', value: '$2.1T', change: '+2.3%', icon: DollarSign },
    { name: 'Total Volume', value: '$85.6B', change: '+5.2%', icon: BarChart3 },
    { name: 'Active Coins', value: '2,843', change: '+12', icon: Activity },
    { name: 'Active Users', value: '125K', change: '+8.4%', icon: Users },
  ];

  if (loading) {
    return <Loading text="Loading market data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CryptoApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Trade Cryptocurrency
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Like a Pro
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Start your crypto journey with our secure and easy-to-use platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Trading Now
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Market Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900">{stat.value}</h4>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-sm font-medium text-green-600">{stat.change}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Coins */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Top Cryptocurrencies
          </h3>
          <Card>
            <Table
              headers={['Coin', 'Price', '24h Change', 'Market Cap', 'Volume']}
            >
              {coins.map((coin) => (
                <TableRow key={coin.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-sm text-gray-500">{coin.symbol}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatPrice(coin.current_price)}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center space-x-1 ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{formatPercentage(coin.price_change_percentage_24h)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatVolume(coin.market_cap)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatVolume(coin.volume_24h)}</div>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose CryptoApp?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with security, simplicity, and performance in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Real-time Trading</h4>
              <p className="text-gray-600">
                Execute trades instantly with real-time market data and advanced trading features.
              </p>
            </Card>
            <Card className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Low Fees</h4>
              <p className="text-gray-600">
                Competitive trading fees starting from 0.1% to maximize your profits.
              </p>
            </Card>
            <Card className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-4">Advanced Analytics</h4>
              <p className="text-gray-600">
                Get insights with comprehensive charts and market analysis tools.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">CryptoApp</h5>
              <p className="text-gray-400">
                Your trusted partner in cryptocurrency trading.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Trading</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Spot Trading</a></li>
                <li><a href="#" className="hover:text-white">Market Data</a></li>
                <li><a href="#" className="hover:text-white">Trading Fees</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CryptoApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

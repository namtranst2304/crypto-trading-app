import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useCoins } from '@/hooks/useCoins';
import { userService } from '@/services/user';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  PieChart, 
  LogOut,
  User,
  Settings,
  Bell
} from 'lucide-react';
import { formatPrice, formatPercentage, formatCurrency } from '@/utils';
import Card from '@/components/Card';
import { Table, TableRow, TableCell } from '@/components/Table';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { UserStats } from '@/types';

const DashboardPage: React.FC = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { coins, loading: coinsLoading } = useCoins({ limit: 10 });
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        const userStats = await userService.getStats();
        setStats(userStats);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (authLoading || !isAuthenticated) {
    return <Loading text="Loading dashboard..." />;
  }

  if (loadingStats) {
    return <Loading text="Loading your data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">CryptoApp</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.username}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                icon={LogOut}
                size="sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h2>
          <p className="mt-2 text-gray-600">
            Here's your portfolio overview and market updates.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.balance || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.portfolio_value || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total_trades || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats?.total_value || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Overview */}
          <Card title="Market Overview" subtitle="Top performing cryptocurrencies">
            {coinsLoading ? (
              <Loading text="Loading market data..." />
            ) : (
              <div className="space-y-4">
                {coins.slice(0, 5).map((coin) => (
                  <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {coin.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-sm text-gray-500">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(coin.current_price)}</p>
                      <p className={`text-sm ${
                        coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" subtitle="Manage your portfolio">
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="h-20 flex-col"
                onClick={() => router.push('/trade')}
              >
                <Activity className="w-6 h-6 mb-2" />
                Trade
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.push('/watchlist')}
              >
                <TrendingUp className="w-6 h-6 mb-2" />
                Watchlist
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.push('/portfolio')}
              >
                <PieChart className="w-6 h-6 mb-2" />
                Portfolio
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.push('/history')}
              >
                <Activity className="w-6 h-6 mb-2" />
                History
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Your latest transactions" className="mt-8">
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-2">
              Start trading to see your transaction history here
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push('/trade')}
            >
              Start Trading
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

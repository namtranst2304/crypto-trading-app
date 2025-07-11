import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useCoins } from '@/hooks/useCoins';
import { useTrades } from '@/hooks/useTrades';
import { Plus, Minus, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { formatPrice, formatPercentage, formatCurrency } from '@/utils';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Table, TableRow, TableCell } from '@/components/Table';
import Loading from '@/components/Loading';
import { toast } from 'react-hot-toast';
import { Coin, TradeRequest } from '@/types';

const TradePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { coins, loading: coinsLoading } = useCoins({ limit: 20 });
  const { createTrade } = useTrades();
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleTrade = async () => {
    if (!selectedCoin || !quantity || parseFloat(quantity) <= 0) {
      toast.error('Please select a coin and enter a valid quantity');
      return;
    }

    setLoading(true);
    
    const tradeData: TradeRequest = {
      coin_id: selectedCoin.id,
      type: tradeType,
      quantity: parseFloat(quantity),
      price: selectedCoin.current_price,
    };

    try {
      await createTrade(tradeData);
      toast.success(`${tradeType === 'buy' ? 'Bought' : 'Sold'} ${quantity} ${selectedCoin.symbol} successfully!`);
      setQuantity('');
      setSelectedCoin(null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedCoin && quantity ? parseFloat(quantity) * selectedCoin.current_price : 0;

  if (!isAuthenticated) {
    return <Loading text="Checking authentication..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              icon={ArrowLeft}
              size="sm"
            >
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trade</h1>
              <p className="text-gray-600">Buy and sell cryptocurrencies</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Available Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(user?.balance || 0)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coin Selection */}
          <div className="lg:col-span-2">
            <Card title="Select Cryptocurrency" subtitle="Choose a coin to trade">
              {coinsLoading ? (
                <Loading text="Loading coins..." />
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {coins.map((coin) => (
                    <div
                      key={coin.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCoin?.id === coin.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCoin(coin)}
                    >
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
                        <div className={`flex items-center space-x-1 text-sm ${
                          coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {coin.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{formatPercentage(coin.price_change_percentage_24h)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Trade Panel */}
          <div>
            <Card title="Trade Panel" subtitle="Execute your trade">
              <div className="space-y-6">
                {/* Trade Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trade Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={tradeType === 'buy' ? 'success' : 'outline'}
                      onClick={() => setTradeType('buy')}
                      icon={Plus}
                      className="justify-center"
                    >
                      Buy
                    </Button>
                    <Button
                      variant={tradeType === 'sell' ? 'danger' : 'outline'}
                      onClick={() => setTradeType('sell')}
                      icon={Minus}
                      className="justify-center"
                    >
                      Sell
                    </Button>
                  </div>
                </div>

                {/* Selected Coin */}
                {selectedCoin && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{selectedCoin.name}</span>
                      <span className="text-sm text-gray-500">{selectedCoin.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current Price</span>
                      <span className="font-medium">{formatPrice(selectedCoin.current_price)}</span>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <Input
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="0"
                  step="0.00000001"
                />

                {/* Total Amount */}
                {totalAmount > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Amount</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Trade Button */}
                <Button
                  className="w-full"
                  onClick={handleTrade}
                  loading={loading}
                  disabled={!selectedCoin || !quantity || parseFloat(quantity) <= 0}
                  variant={tradeType === 'buy' ? 'success' : 'danger'}
                >
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCoin?.symbol || 'Crypto'}
                </Button>

                {/* Warning */}
                <div className="text-xs text-gray-500 text-center">
                  <p>* This is a simulated trading environment</p>
                  <p>* All trades are executed at current market prices</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePage;

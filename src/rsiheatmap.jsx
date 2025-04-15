import React, { useEffect, useState } from 'react'; import axios from 'axios'; import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const RSI_LEVELS = { overbought: 70, oversold: 30, };

const getRSI = (closes) => { let gains = 0; let losses = 0;

for (let i = 1; i < closes.length; i++) { const change = closes[i] - closes[i - 1]; if (change >= 0) gains += change; else losses -= change; }

const averageGain = gains / 14; const averageLoss = losses / 14; const rs = averageGain / averageLoss; const rsi = 100 - 100 / (1 + rs);

return Math.round(rsi); };

export default function RSIHeatmap() { const [rsiData, setRsiData] = useState([]); const [timeframe, setTimeframe] = useState('hourly'); const [loading, setLoading] = useState(false);

useEffect(() => { const fetchRSI = async () => { setLoading(true); try { const topCoins = await axios.get( 'https://api.coingecko.com/api/v3/coins/markets', { params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 100, page: 1, }, } );

const rsiPromises = topCoins.data.map(async (coin) => {
      const id = coin.id;
      const prices = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: timeframe === 'hourly' ? 1 : 14,
            interval: timeframe === 'hourly' ? 'hourly' : 'daily',
          },
        }
      );
      const closes = prices.data.prices.map((p) => p[1]);
      const last14 = closes.slice(-15);
      return {
        symbol: coin.symbol.toUpperCase(),
        rsi: last14.length >= 15 ? getRSI(last14) : null,
      };
    });

    const results = await Promise.all(rsiPromises);
    setRsiData(results);
  } catch (error) {
    console.error(error);
  }
  setLoading(false);
};

fetchRSI();

}, [timeframe]);

const getColor = (rsi) => { if (rsi == null) return 'bg-gray-300'; if (rsi > RSI_LEVELS.overbought) return 'bg-red-400'; if (rsi < RSI_LEVELS.oversold) return 'bg-blue-400'; return 'bg-green-400'; };

return ( <div className="p-4"> <h1 className="text-2xl font-bold mb-4 text-white text-center"> Vanguard Cryptocurrency RSI Heatmap </h1>

<div className="flex justify-center mb-4">
    <ToggleGroup type="single" value={timeframe} onValueChange={setTimeframe}>
      <ToggleGroupItem value="hourly">Hourly RSI</ToggleGroupItem>
      <ToggleGroupItem value="daily">Daily RSI</ToggleGroupItem>
    </ToggleGroup>
  </div>

  {loading ? (
    <p className="text-white text-center">Loading...</p>
  ) : (
    <div className="grid grid-cols-5 gap-2">
      {rsiData.map((coin) => (
        <div
          key={coin.symbol}
          className={`p-2 rounded-xl text-white text-center ${getColor(coin.rsi)}`}
        >
          {coin.symbol}
          <div className="text-xs">RSI: {coin.rsi ?? '-'}</div>
        </div>
      ))}
    </div>
  )}
</div>

); }


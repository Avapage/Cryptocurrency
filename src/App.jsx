import React from "react";

const coins = [
  { name: "Bitcoin", symbol: "BTC", rsi: 25 },
  { name: "Ethereum", symbol: "ETH", rsi: 45 },
  { name: "Solana", symbol: "SOL", rsi: 75 },
  { name: "Ripple", symbol: "XRP", rsi: 65 },
  { name: "Cardano", symbol: "ADA", rsi: 29 },
];

const getColor = (rsi) => {
  if (rsi < 30) return "bg-green-500"; // Oversold
  if (rsi > 70) return "bg-red-500"; // Overbought
  return "bg-yellow-500"; // Neutral
};

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Vanguard Cryptocurrency — RSI Heatmap</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <div
            key={coin.symbol}
            className={`p-4 rounded-2xl shadow ${getColor(coin.rsi)}`}
          >
            <h2 className="text-xl font-semibold">
              {coin.name} ({coin.symbol})
            </h2>
            <p className="text-2xl">RSI: {coin.rsi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

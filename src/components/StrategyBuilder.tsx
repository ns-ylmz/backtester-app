'use client';
import { useState } from 'react';

interface StrategyBlock {
  id: string;
  type: 'indicator' | 'condition' | 'action';
  name: string;
  position: { x: number; y: number };
  parameters?: { [key: string]: any };
}

const initialIndicators = [
  { id: 'rsi', name: 'RSI', type: 'indicator' as const },
  { id: 'macd', name: 'MACD', type: 'indicator' as const },
  { id: 'sma', name: 'Moving Average', type: 'indicator' as const },
  { id: 'volume', name: 'Volume', type: 'indicator' as const },
  { id: 'bollinger', name: 'Bollinger Bands', type: 'indicator' as const },
  { id: 'buy', name: 'BUY', type: 'action' as const },
  { id: 'sell', name: 'SELL', type: 'action' as const },
];

export default function StrategyBuilder() {
  const [blocks, setBlocks] = useState<StrategyBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<StrategyBlock | null>(null);

  const addBlock = (indicator: typeof initialIndicators[0]) => {
    const newBlock: StrategyBlock = {
      id: `${indicator.id}-${Date.now()}`,
      type: indicator.type,
      name: indicator.name,
      position: { 
        x: 50 + (blocks.length % 3) * 200,  // Yatay dağıt
        y: 50 + Math.floor(blocks.length / 3) * 120  // Dikey dağıt
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[800px] lg:h-[600px] bg-gray-900 text-white rounded-lg border border-gray-700 overflow-hidden">
        {/* SIDEBAR - INDICATORS */}
        <div className="w-full lg:w-80 bg-gray-800 p-4 border-b lg:border-r border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Trading Indicators</h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {initialIndicators.map((indicator) => (
                    <button
                        key={indicator.id}
                        onClick={() => addBlock(indicator)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm lg:text-base"
                    >
                        {indicator.name}
                    </button>
                ))}
                {selectedBlock && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                        <h3 className="font-bold text-white mb-2 text-sm">Seçili Blok</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                        <div>📊 {selectedBlock.name}</div>
                        <div>🎯 Tür: {selectedBlock.type}</div>
                        <div>📍 Pozisyon: {selectedBlock.position.x}px, {selectedBlock.position.y}px</div>
                        </div>
                        <button
                            onClick={() => setSelectedBlock(null)}
                            className="mt-3 w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                        >
                        Seçimi Temizle
                        </button>
                        <button
                            onClick={() => {
                                if (confirm(`${selectedBlock.name} bloğunu silmek istediğinize emin misiniz?`)) {
                                setBlocks(blocks.filter(b => b.id !== selectedBlock.id));
                                setSelectedBlock(null);
                            }
                        }}
                        className="mt-2 w-full px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-sm transition-colors"
                        >
                        🗑️ Bloğu Sil
                        </button>
                    </div>
                )}
            </div>
        </div>
      
        {/* CANVAS - STRATEGY BUILDER */}
        <div className="flex-1 bg-gray-700 p-4 relative min-h-[400px]">
            <div 
                className="bg-gray-600 rounded-lg h-full border-2 border-dashed border-gray-500 relative"
                style={{
                    backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '30px 30px'
                }}
            >
          {blocks.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p>Drag indicators from the sidebar to start building your strategy</p>
              </div>
            </div>
          ) : (
            blocks.map((block) => (
                <div
                    key={block.id}
                    className={`
                        absolute min-w-[120px] px-4 py-3 rounded-lg shadow-lg cursor-move border-2
                        ${selectedBlock?.id === block.id ? 'border-yellow-400 bg-blue-700' : 'border-blue-400 bg-blue-600'}
                        ${block.type === 'action' ? 'bg-green-600 border-green-400' : ''}
                        ${block.type === 'condition' ? 'bg-purple-600 border-purple-400' : ''}
                    `}
                    style={{ left: block.position.x, top: block.position.y }}
                    onClick={() => setSelectedBlock(block)}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        if (confirm(`${block.name} bloğunu silmek istediğinize emin misiniz?`)) {
                          setBlocks(blocks.filter(b => b.id !== block.id));
                          setSelectedBlock(null);
                        }
                    }}
                >
                    <div className="font-semibold text-white text-center">{block.name}</div>
                    <div className="text-xs text-blue-200 text-center capitalize">{block.type}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
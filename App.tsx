import React, { useState } from 'react';
import PeriodicTable from './components/PeriodicTable';
import CompoundGrid from './components/CompoundGrid';
import ElementCard from './components/ElementCard';
import ChatInterface from './components/ChatInterface';
import ReactionLab from './components/ReactionLab';
import { ChemicalItem, isElement } from './types';

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ChemicalItem | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'lab'>('info');
  const [libraryMode, setLibraryMode] = useState<'elements' | 'compounds'>('elements');

  return (
    <div className="min-h-screen pb-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                C
              </div>
              <span className="font-bold text-xl tracking-tight">ChemAI</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
               <span>Powered by Gemini 2.5</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Library (Elements/Compounds) & Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Library Toggle */}
            <div className="flex bg-slate-800/50 p-1 rounded-lg self-start border border-slate-700">
                <button 
                    onClick={() => setLibraryMode('elements')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${libraryMode === 'elements' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    元素周期表
                </button>
                <button 
                    onClick={() => setLibraryMode('compounds')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${libraryMode === 'compounds' ? 'bg-green-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    常用化合物
                </button>
            </div>

            {libraryMode === 'elements' ? (
                <PeriodicTable 
                    onSelectItem={setSelectedItem} 
                    selectedItemId={selectedItem && isElement(selectedItem) ? selectedItem.number : undefined}
                />
            ) : (
                <CompoundGrid
                    onSelectItem={setSelectedItem}
                    selectedItemFormula={selectedItem && !isElement(selectedItem) ? selectedItem.formula : undefined}
                />
            )}
            
            {/* Detail View (Only visible if selected) */}
            {selectedItem && (
              <div className="glass-panel p-6 rounded-xl animate-fade-in-up">
                 <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <ElementCard 
                        data={selectedItem} 
                        onClick={() => {}} // Already selected
                    />
                    <div className="flex-1 space-y-3 w-full">
                        <h2 className="text-3xl font-bold">{selectedItem.name}</h2>
                        
                        {isElement(selectedItem) ? (
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="block text-gray-500 text-xs">原子量</span>
                                    {selectedItem.atomicMass}
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="block text-gray-500 text-xs">电子排布</span>
                                    {selectedItem.electronConfiguration}
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="block text-gray-500 text-xs">分类</span>
                                    {selectedItem.category}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="block text-gray-500 text-xs">化学式</span>
                                    {selectedItem.formula}
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="block text-gray-500 text-xs">摩尔质量</span>
                                    {selectedItem.molarMass} g/mol
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="block text-gray-500 text-xs">分类</span>
                                    {selectedItem.category}
                                </div>
                            </div>
                        )}

                        <p className="text-gray-300 leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-500/5 p-2 rounded-r">
                            {selectedItem.summary}
                        </p>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Right Column: Interaction Area (Chat or Lab) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
             {/* Tab Switcher */}
             <div className="flex bg-slate-800 p-1 rounded-lg self-start">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'info' ? 'bg-slate-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    AI 助手
                </button>
                <button 
                    onClick={() => setActiveTab('lab')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'lab' ? 'bg-slate-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                    虚拟实验室
                </button>
             </div>

             {/* Tab Content */}
             <div className="flex-1 relative">
                {activeTab === 'info' ? (
                     <ChatInterface selectedItem={selectedItem} />
                ) : (
                     <ReactionLab 
                        currentSelection={selectedItem} 
                        onClearSelection={() => setSelectedItem(null)}
                     />
                )}
             </div>
          </div>

        </div>
      </main>
      
      {/* Simple global styles injection for animations */}
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes pulseOnce {
             0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
             70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
             100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .animate-pulse-once {
            animation: pulseOnce 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;
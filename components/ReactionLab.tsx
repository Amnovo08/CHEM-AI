import React, { useState, useEffect } from 'react';
import { ChemicalItem, isElement } from '../types';
import { analyzeReaction } from '../services/geminiService';
import ReactionAnimator, { AnimationType } from './ReactionAnimator';
import { getCategoryColor } from '../constants';

interface ReactionLabProps {
  currentSelection: ChemicalItem | null;
  onClearSelection: () => void;
}

interface VisualConfig {
    liquidColor?: string;
    showBall?: boolean;
    flameColor?: string;
    particleColor?: string;
}

const COMMON_CONDITIONS = ["点燃", "加热", "高温", "催化剂", "高压", "通电", "光照"];

const ReactionLab: React.FC<ReactionLabProps> = ({ currentSelection, onClearSelection }) => {
  const [reactants, setReactants] = useState<ChemicalItem[]>([]);
  const [condition, setCondition] = useState("");
  const [result, setResult] = useState<{ equation: string; description: string; type: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [animState, setAnimState] = useState<AnimationType>('idle');
  const [visualConfig, setVisualConfig] = useState<VisualConfig>({});

  const handleAddReactant = (item: ChemicalItem) => {
    // Prevent duplicates for simplicity, though physically possible.
    const id = isElement(item) ? item.symbol : item.formula;
    if (reactants.some(r => (isElement(r) ? r.symbol : r.formula) === id)) {
        return;
    }

    // Reset result if we modify inputs
    if (result || animState !== 'idle') {
        setResult(null);
        setAnimState('idle');
        setVisualConfig({});
    }

    setReactants(prev => [...prev, item]);
  };

  const handleRemoveReactant = (index: number) => {
      setReactants(prev => prev.filter((_, i) => i !== index));
      setResult(null);
      setAnimState('idle');
      setVisualConfig({});
  };

  const determineAnimationType = (res: { type: string, description: string }): AnimationType => {
      const text = (res.type + res.description).toLowerCase();
      
      if (text.includes("燃烧") || text.includes("爆炸") || text.includes("burn") || text.includes("combustion") || text.includes("fire") || text.includes("剧烈") || text.includes("点燃")) return 'fire';
      if (text.includes("气泡") || text.includes("气体") || text.includes("bubble") || text.includes("gas") || text.includes("fizz")) return 'gas';
      if (text.includes("沉淀") || text.includes("固体") || text.includes("结晶") || text.includes("浑浊") || text.includes("solid") || text.includes("precipitate") || text.includes("crystal")) return 'solid';
      if (text.includes("中和") || text.includes("溶解") || text.includes("liquid") || text.includes("color change") || text.includes("溶液")) return 'neutral';
      if (text.includes("无反应") || text.includes("物理混合")) return 'idle'; 
      
      return 'neutral'; // Default success state
  };

  const checkSpecialVisuals = (items: ChemicalItem[], cond: string, resultDescription: string = ""): VisualConfig => {
      const symbols = items.map(item => isElement(item) ? item.symbol : item.formula);
      const has = (key: string) => symbols.some(s => s === key || s.includes(key));
      const desc = resultDescription;
      
      let config: VisualConfig = {};

      // 1. Analyze Reactants for specific logic
      // Alkali Metals + Water Case
      const isAlkali = symbols.some(s => ['Li', 'Na', 'K', 'Rb', 'Cs'].includes(s));
      const isWater = has('H2O') || has('H₂O');

      if (isAlkali && isWater) {
          config = {
              liquidColor: '#cffafe', // Clear/Light Cyan (Sodium Hydroxide solution is colorless)
              showBall: true, // Molten metal ball
              flameColor: '#facc15' // Yellow flame (typical for Na)
          };
      }
      
      // Copper Sulfate solution usually blue
      if (has('CuSO4') || has('CuSO₄')) {
          config.liquidColor = '#3b82f6';
      }

      // KMnO4 solution purple
      if (has('KMnO4') || has('KMnO₄')) {
          config.liquidColor = '#c026d3'; // fuchsia-600
      }

      // 2. Analyze Result Description for dynamic color adjustments (Precipitates/Solutions)
      
      // Blue Precipitate (e.g., Cu(OH)2)
      if (desc.includes("蓝") && (desc.includes("沉淀") || desc.includes("絮状"))) {
          config.liquidColor = '#eff6ff'; // Clearish
          config.particleColor = '#3b82f6'; // Blue solid
      }
      // Red-Brown Precipitate (e.g., Fe(OH)3)
      else if (desc.includes("红褐") && desc.includes("沉淀")) {
          config.liquidColor = '#fff1f2'; 
          config.particleColor = '#b91c1c'; // Red-800
      }
      // Black Solid (e.g., MnO2, CuO, Fe3O4)
      else if (desc.includes("黑") && (desc.includes("固体") || desc.includes("沉淀") || desc.includes("粉末"))) {
           // Keep liquid color if already set (e.g. purple KMnO4 turning colorless?), otherwise clear
           if (!config.liquidColor) config.liquidColor = '#f8fafc';
           config.particleColor = '#1e293b'; // Slate-800
      }
      // White Precipitate (e.g., AgCl, BaSO4, CaCO3, Mg(OH)2)
      else if (desc.includes("白") && (desc.includes("沉淀") || desc.includes("浑浊"))) {
          config.particleColor = '#ffffff';
          if (!config.liquidColor) config.liquidColor = '#cbd5e1';
      }
      
      // Solution Color Changes
      if (desc.includes("溶液") && desc.includes("蓝") && !desc.includes("沉淀")) {
          config.liquidColor = '#3b82f6'; // Blue solution (Cu2+)
      }
      if (desc.includes("溶液") && desc.includes("黄") && !desc.includes("沉淀")) {
          config.liquidColor = '#eab308'; // Yellow solution (Fe3+)
      }
      if (desc.includes("溶液") && desc.includes("浅绿") && !desc.includes("沉淀")) {
          config.liquidColor = '#86efac'; // Light Green solution (Fe2+)
      }

      return config;
  };

  const handleReact = async () => {
    if (reactants.length === 0) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setVisualConfig({});
    setAnimState('mixing');

    const analysis = await analyzeReaction(reactants, condition);
    
    try {
        const parsed = JSON.parse(analysis);
        setResult(parsed);
        
        // Wait a small moment for the "mixing" animation to register before showing result animation
        setTimeout(() => {
             const type = determineAnimationType(parsed);
             // Pass the description to checkSpecialVisuals to extract colors
             const specials = checkSpecialVisuals(reactants, condition, parsed.description);
             
             setVisualConfig(specials);
             setAnimState(type);
        }, 1500);

    } catch (e) {
        setResult({
            equation: "解析错误",
            description: "AI返回的数据格式无法识别。",
            type: "Error"
        });
        setAnimState('idle');
    }
    
    setIsAnalyzing(false);
  };

  const handleClear = () => {
    setReactants([]);
    setCondition("");
    setResult(null);
    setAnimState('idle');
    setVisualConfig({});
  };

  // Determine base colors for the mixer based on first two ingredients
  const getColor = (idx: number) => {
      if (!reactants[idx]) return idx === 0 ? '#3b82f6' : '#a855f7';
      const cat = reactants[idx].category;
      // Extract color from tailwind class string mapping in constants is tricky, 
      // so we use simplified mapping here for the animator props
      if (cat.includes("Alkali")) return '#ef4444'; // red
      if (cat.includes("Gas")) return '#6366f1'; // indigo
      if (cat.includes("Acid")) return '#f43f5e'; // rose
      if (cat.includes("Base")) return '#8b5cf6'; // violet
      if (cat.includes("Salt")) return '#10b981'; // emerald
      if (cat.includes("Water")) return '#3b82f6'; // blue
      return '#64748b'; // slate
  };

  return (
    <div className="glass-panel p-6 rounded-xl flex flex-col gap-6 relative overflow-hidden min-h-[600px]">
      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            多功能反应釜
        </h2>
        <button 
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-white underline"
        >
            重置实验
        </button>
      </div>

      {/* Main Animation Stage */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
         <ReactionAnimator 
            status={animState} 
            color1={getColor(0)} 
            color2={getColor(1)}
            liquidColor={visualConfig.liquidColor}
            showBall={visualConfig.showBall}
            flameColor={visualConfig.flameColor}
            particleColor={visualConfig.particleColor}
        />
        
        {/* Status Text under animation */}
        {animState !== 'idle' && (
            <div className="absolute bottom-0 text-center animate-pulse">
                <span className="text-blue-300 text-sm font-medium tracking-wider">
                    {animState === 'mixing' ? '正在分析反应...' : '反应进行中'}
                </span>
            </div>
        )}
      </div>

      {/* Reactant List Area */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">反应物 ({reactants.length})</span>
            
            {/* Context Add Button */}
            {currentSelection && (
                <button
                    onClick={() => handleAddReactant(currentSelection)}
                    disabled={reactants.length >= 5 || isAnalyzing || animState !== 'idle'}
                    className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-3 py-1 rounded-full transition-colors"
                >
                    <span>+ 添加 {isElement(currentSelection) ? currentSelection.symbol : currentSelection.formula}</span>
                </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 min-h-[60px] items-center">
              {reactants.length === 0 ? (
                  <span className="text-sm text-gray-500 italic w-full text-center py-2">
                      暂无反应物。请从左侧选择物质并添加。
                  </span>
              ) : (
                  reactants.map((item, idx) => {
                      const id = isElement(item) ? item.symbol : item.formula;
                      const colorClass = getCategoryColor(item.category);
                      return (
                          <div key={idx} className={`animate-fade-in-up flex items-center gap-2 px-3 py-2 rounded-lg border bg-slate-800 ${colorClass.split(' ')[1] || 'border-gray-500'}`}>
                              <span className="font-bold text-white">{id}</span>
                              <span className="text-xs text-gray-300 hidden md:inline">{item.name.split(' ')[0]}</span>
                              <button 
                                onClick={() => handleRemoveReactant(idx)}
                                disabled={isAnalyzing || animState !== 'idle'}
                                className="ml-1 text-gray-400 hover:text-red-400"
                              >
                                  ×
                              </button>
                          </div>
                      );
                  })
              )}
          </div>
      </div>

      {/* Conditions Input */}
      <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
              {COMMON_CONDITIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => {
                        if(condition.includes(c)) setCondition(condition.replace(c, '').trim());
                        else setCondition(`${condition} ${c}`.trim());
                    }}
                    disabled={isAnalyzing || animState !== 'idle'}
                    className={`text-xs px-2 py-1 rounded border transition-colors ${condition.includes(c) ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-600 text-gray-400 hover:text-white'}`}
                  >
                      {c}
                  </button>
              ))}
          </div>
          <div className="flex gap-2">
            <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="输入反应条件 (如: 催化剂, 500℃)..."
                disabled={isAnalyzing || animState !== 'idle'}
                className="flex-1 bg-slate-900 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
         <button
            onClick={handleReact}
            disabled={reactants.length === 0 || isAnalyzing || animState !== 'idle'}
            className={`
                w-full md:w-auto px-12 py-3 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2
                ${(reactants.length === 0 || animState !== 'idle') ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-blue-500/20 active:scale-95 border border-white/10'}
            `}
         >
            {isAnalyzing ? (
                <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 分析反应中...
                </>
            ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.761 2.15 17.2 4.824 17.2H15.176c2.675 0 4.008-2.439 2.114-4.321l-4-4a1 1 0 01-.293-.707V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.188a4 4 0 00-2.141 0A4.025 4.025 0 005.122 12.3l1.002-1.006A3 3 0 009 8.172z" clipRule="evenodd" />
                </svg>
                开始实验
                </>
            )}
         </button>
      </div>

      {/* Results Display */}
      {result && (
        <div className="mt-2 p-6 bg-slate-800/90 rounded-xl border border-white/10 shadow-2xl animate-fade-in-up z-20">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    实验报告
                </span>
                <span className="text-xs text-blue-200 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full">{result.type}</span>
            </div>
            <div className="text-center mb-6 py-4 bg-black/20 rounded-lg overflow-x-auto">
                <div className="text-xl md:text-2xl font-serif text-white tracking-wide whitespace-nowrap px-4" style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}>
                    {result.equation}
                </div>
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                {result.description}
            </p>
        </div>
      )}
    </div>
  );
};

export default ReactionLab;
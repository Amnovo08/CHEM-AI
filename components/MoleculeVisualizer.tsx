import React, { useState, useEffect } from 'react';

interface Atom {
  x: number;
  y: number;
  r: number;
  color: string;
  symbol: string;
}

interface Bond {
  from: number;
  to: number;
  width: number;
}

interface MoleculeConfig {
  atoms: Atom[];
  bonds: Bond[];
  viewBox: string;
}

const ATOM_NAMES: Record<string, string> = {
  "H": "氢",
  "He": "氦",
  "Li": "锂",
  "Be": "铍",
  "B": "硼",
  "C": "碳",
  "N": "氮",
  "O": "氧",
  "F": "氟",
  "Ne": "氖",
  "Na": "钠",
  "Mg": "镁",
  "Al": "铝",
  "Si": "硅",
  "P": "磷",
  "S": "硫",
  "Cl": "氯",
  "Ar": "氩",
  "K": "钾",
  "Ca": "钙",
  "Mn": "锰",
  "Fe": "铁",
  "Cu": "铜",
  "Zn": "锌",
  "Ag": "银",
  "Au": "金",
  "Hg": "汞",
  "Pb": "铅",
};

// Configuration for common molecules (2D projection)
const MOLECULES: Record<string, MoleculeConfig> = {
  "H2O": {
    viewBox: "0 0 100 100",
    atoms: [
      { x: 50, y: 40, r: 15, color: "#ef4444", symbol: "O" }, // Oxygen
      { x: 25, y: 70, r: 10, color: "#e2e8f0", symbol: "H" }, // Hydrogen left
      { x: 75, y: 70, r: 10, color: "#e2e8f0", symbol: "H" }, // Hydrogen right
    ],
    bonds: [
      { from: 0, to: 1, width: 4 },
      { from: 0, to: 2, width: 4 },
    ]
  },
  "CO2": {
    viewBox: "0 0 120 60",
    atoms: [
      { x: 60, y: 30, r: 14, color: "#64748b", symbol: "C" }, // Carbon
      { x: 20, y: 30, r: 12, color: "#ef4444", symbol: "O" }, // Oxygen left
      { x: 100, y: 30, r: 12, color: "#ef4444", symbol: "O" }, // Oxygen right
    ],
    bonds: [
      { from: 0, to: 1, width: 6 }, // Double bond representation
      { from: 0, to: 2, width: 6 },
    ]
  },
  "CH4": {
    viewBox: "0 0 100 100",
    atoms: [
      { x: 50, y: 50, r: 14, color: "#64748b", symbol: "C" }, // Carbon
      { x: 50, y: 20, r: 9, color: "#e2e8f0", symbol: "H" }, // Top
      { x: 20, y: 80, r: 9, color: "#e2e8f0", symbol: "H" }, // Left
      { x: 80, y: 80, r: 9, color: "#e2e8f0", symbol: "H" }, // Right
      { x: 65, y: 65, r: 9, color: "#94a3b8", symbol: "H" }, // Front (simulated depth)
    ],
    bonds: [
      { from: 0, to: 1, width: 3 },
      { from: 0, to: 2, width: 3 },
      { from: 0, to: 3, width: 3 },
      { from: 0, to: 4, width: 3 },
    ]
  },
  "NH3": {
    viewBox: "0 0 100 100",
    atoms: [
      { x: 50, y: 40, r: 14, color: "#3b82f6", symbol: "N" }, // Nitrogen
      { x: 20, y: 80, r: 9, color: "#e2e8f0", symbol: "H" },
      { x: 80, y: 80, r: 9, color: "#e2e8f0", symbol: "H" },
      { x: 50, y: 90, r: 9, color: "#94a3b8", symbol: "H" }, // Front
    ],
    bonds: [
      { from: 0, to: 1, width: 3 },
      { from: 0, to: 2, width: 3 },
      { from: 0, to: 3, width: 3 },
    ]
  },
  "O2": {
    viewBox: "0 0 100 60",
    atoms: [
      { x: 30, y: 30, r: 14, color: "#ef4444", symbol: "O" },
      { x: 70, y: 30, r: 14, color: "#ef4444", symbol: "O" },
    ],
    bonds: [
      { from: 0, to: 1, width: 6 },
    ]
  },
  "NaCl": {
     viewBox: "0 0 100 60",
     atoms: [
       { x: 35, y: 30, r: 12, color: "#a855f7", symbol: "Na" },
       { x: 65, y: 30, r: 16, color: "#22c55e", symbol: "Cl" },
     ],
     bonds: [
       { from: 0, to: 1, width: 2 }, 
     ]
  },
  "HCl": {
     viewBox: "0 0 100 60",
     atoms: [
       { x: 35, y: 30, r: 10, color: "#e2e8f0", symbol: "H" },
       { x: 65, y: 30, r: 16, color: "#22c55e", symbol: "Cl" },
     ],
     bonds: [
       { from: 0, to: 1, width: 3 },
     ]
  },
  "KMnO4": {
    viewBox: "0 0 140 100",
    atoms: [
        { x: 25, y: 30, r: 14, color: "#d8b4fe", symbol: "K" }, // K+ ion
        { x: 85, y: 50, r: 14, color: "#7e22ce", symbol: "Mn" }, // Mn central
        { x: 85, y: 20, r: 10, color: "#ef4444", symbol: "O" }, // Top
        { x: 60, y: 65, r: 10, color: "#ef4444", symbol: "O" }, // Left
        { x: 110, y: 65, r: 10, color: "#ef4444", symbol: "O" }, // Right
        { x: 85, y: 75, r: 10, color: "#ef4444", symbol: "O" }, // Front/Bottom
    ],
    bonds: [
        { from: 1, to: 2, width: 3 },
        { from: 1, to: 3, width: 3 },
        { from: 1, to: 4, width: 3 },
        { from: 1, to: 5, width: 3 },
    ]
  }
};

interface MoleculeVisualizerProps {
  formula: string;
}

const MoleculeVisualizer: React.FC<MoleculeVisualizerProps> = ({ formula }) => {
  const [selectedAtomIndex, setSelectedAtomIndex] = useState<number | null>(null);

  // Normalize formula (remove subscripts for matching keys if needed)
  const config = MOLECULES[formula] || MOLECULES[formula.replace(/₂/g, '2').replace(/₃/g, '3').replace(/₄/g, '4')];

  // Reset selection when formula changes
  useEffect(() => {
    setSelectedAtomIndex(null);
  }, [formula]);

  if (!config) return null;

  return (
    <div className="mt-3 inline-block bg-slate-800/80 rounded-xl p-4 border border-slate-600 shadow-inner select-none">
      <div className="text-xs text-gray-400 mb-2 text-center flex justify-between px-2">
        <span>结构: {formula}</span>
        <span className="text-gray-500 italic">点击原子查看名称</span>
      </div>
      <div className="w-48 h-48 flex items-center justify-center relative">
        <svg 
            viewBox={config.viewBox} 
            className="w-full h-full overflow-visible animate-float"
            style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" }}
        >
            <style>
            {`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-5px) rotate(2deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .atom-group {
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-box: fill-box;
                    transform-origin: center;
                    cursor: pointer;
                }
                .atom-group:hover {
                    filter: brightness(1.15);
                }
                .atom-group.selected {
                    transform: scale(1.25);
                    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
                }
            `}
            </style>
          {/* Bonds */}
          {config.bonds.map((bond, idx) => {
            const start = config.atoms[bond.from];
            const end = config.atoms[bond.to];
            return (
              <line
                key={`bond-${idx}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#94a3b8"
                strokeWidth={bond.width}
                strokeLinecap="round"
                className="opacity-60"
              />
            );
          })}
          
          {/* Atoms */}
          {config.atoms.map((atom, idx) => {
             const isSelected = selectedAtomIndex === idx;
             return (
                <g 
                    key={`atom-${idx}`} 
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAtomIndex(isSelected ? null : idx);
                    }}
                    className={`atom-group ${isSelected ? 'selected' : ''}`}
                >
                    <circle
                    cx={atom.x}
                    cy={atom.y}
                    r={atom.r}
                    fill={atom.color}
                    stroke="white"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                    />
                    {/* Shine */}
                    <circle
                    cx={atom.x - atom.r * 0.3}
                    cy={atom.y - atom.r * 0.3}
                    r={atom.r * 0.25}
                    fill="white"
                    fillOpacity="0.3"
                    />
                    {/* Symbol */}
                    <text
                        x={atom.x}
                        y={atom.y}
                        dy=".35em"
                        textAnchor="middle"
                        fill="white"
                        fontSize={atom.r * 0.9}
                        fontWeight="bold"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                        pointerEvents="none"
                    >
                        {atom.symbol}
                    </text>
                </g>
             );
          })}

          {/* Tooltip Label for Selected Atom */}
          {selectedAtomIndex !== null && (
             <g transform={`translate(${config.atoms[selectedAtomIndex].x}, ${config.atoms[selectedAtomIndex].y - config.atoms[selectedAtomIndex].r - 12})`}>
                 <rect 
                    x="-30" 
                    y="-16" 
                    width="60" 
                    height="18" 
                    rx="4" 
                    fill="rgba(15, 23, 42, 0.9)" 
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="0.5"
                 />
                 <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="10"
                    fontWeight="bold"
                 >
                    {ATOM_NAMES[config.atoms[selectedAtomIndex].symbol] || config.atoms[selectedAtomIndex].symbol}
                 </text>
                 {/* Small triangle pointer */}
                 <path d="M -4 2 L 4 2 L 0 6 Z" fill="rgba(15, 23, 42, 0.9)" />
             </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export default MoleculeVisualizer;
import React from 'react';
import { COMPOUNDS } from '../constants';
import { ChemicalItem } from '../types';
import ElementCard from './ElementCard';

interface CompoundGridProps {
  onSelectItem: (item: ChemicalItem) => void;
  selectedItemFormula?: string;
}

const CompoundGrid: React.FC<CompoundGridProps> = ({ onSelectItem, selectedItemFormula }) => {
  return (
    <div className="p-4 overflow-x-auto glass-panel rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        常见化合物
      </h2>
      <div className="flex flex-wrap gap-3 justify-start">
        {COMPOUNDS.map((compound) => (
          <ElementCard
            key={compound.formula}
            data={compound}
            isSmall={true}
            isSelected={selectedItemFormula === compound.formula}
            onClick={() => onSelectItem(compound)}
          />
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-400">
        * 点击化合物查看详情或进行虚拟实验
      </div>
    </div>
  );
};

export default CompoundGrid;
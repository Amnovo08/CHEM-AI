import React from 'react';
import { ELEMENTS } from '../constants';
import { ChemicalItem } from '../types';
import ElementCard from './ElementCard';

interface PeriodicTableProps {
  onSelectItem: (item: ChemicalItem) => void;
  selectedItemId?: string | number;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onSelectItem, selectedItemId }) => {
  return (
    <div className="p-4 overflow-x-auto glass-panel rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        元素周期表
      </h2>
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 min-w-[300px]">
        {ELEMENTS.map((element) => (
          <ElementCard
            key={element.number}
            data={element}
            isSmall={true}
            isSelected={selectedItemId === element.number}
            onClick={() => onSelectItem(element)}
          />
        ))}
        {/* Placeholder for future elements to fill grid nicely if needed */}
        {Array.from({ length: 18 - ELEMENTS.length }).map((_, i) => (
            <div key={`placeholder-${i}`} className="w-10 h-10 md:w-16 md:h-16 opacity-10 border border-dashed border-gray-600 rounded-lg"></div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-400">
        * 点击元素查看详情或进行虚拟实验
      </div>
    </div>
  );
};

export default PeriodicTable;
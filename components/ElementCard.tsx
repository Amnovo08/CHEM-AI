import React from 'react';
import { getCategoryColor } from '../constants';
import { ChemicalItem, isElement } from '../types';

interface ElementCardProps {
  data: ChemicalItem;
  isSelected?: boolean;
  onClick: () => void;
  isSmall?: boolean;
}

const ElementCard: React.FC<ElementCardProps> = ({ data, isSelected, onClick, isSmall }) => {
  const colorClass = getCategoryColor(data.category);
  
  // Dynamic scaling for "isSmall" vs Standard
  const sizeClasses = isSmall 
    ? "w-12 h-12 md:w-16 md:h-16 text-xs" 
    : "w-32 h-32 md:w-40 md:h-40 text-base";

  const isElem = isElement(data);
  const symbolOrFormula = isElem ? data.symbol : data.formula;
  // For compounds, the formula might be long, so adjust font size
  const mainTextSize = isSmall 
     ? (symbolOrFormula.length > 3 ? 'text-xs' : 'text-lg') 
     : (symbolOrFormula.length > 4 ? 'text-2xl' : 'text-4xl');

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 transform 
        border-2 shadow-lg flex flex-col items-center justify-center
        ${sizeClasses}
        ${isSelected ? 'scale-110 z-10 ring-4 ring-white ring-opacity-50' : 'hover:scale-105 hover:z-10 hover:brightness-110'}
        ${colorClass}
        rounded-lg text-white font-bold select-none
      `}
    >
      {isElem && (
        <span className={`absolute top-1 left-1 opacity-80 ${isSmall ? 'text-[0.6rem]' : 'text-sm'}`}>
          {data.number}
        </span>
      )}
      <span className={`${mainTextSize} drop-shadow-md text-center break-words px-1`}>
        {symbolOrFormula}
      </span>
      {!isSmall && (
         <span className="text-xs font-normal mt-1 opacity-90 truncate max-w-full px-1">
          {data.name.split(' ')[0]}
         </span>
      )}
      
      {/* Visual Shine Effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default ElementCard;
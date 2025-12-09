export enum ElementCategory {
  Nonmetal = 'Nonmetal',
  NobleGas = 'Noble Gas',
  AlkaliMetal = 'Alkali Metal',
  AlkalineEarthMetal = 'Alkaline Earth Metal',
  Metalloid = 'Metalloid',
  Halogen = 'Halogen',
  PostTransitionMetal = 'Post-Transition Metal',
  TransitionMetal = 'Transition Metal',
  Lanthanide = 'Lanthanide',
  Actinide = 'Actinide',
  Unknown = 'Unknown'
}

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  atomicMass: string;
  summary: string;
  electronConfiguration: string;
}

export interface CompoundData {
  formula: string;
  name: string;
  category: string;
  molarMass: string;
  summary: string;
}

export type ChemicalItem = ElementData | CompoundData;

export function isElement(item: ChemicalItem): item is ElementData {
  return (item as ElementData).number !== undefined;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface ReactionResult {
  equation: string;
  description: string;
  type: string;
}
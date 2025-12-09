import { ElementData, ElementCategory, CompoundData, ChemicalItem, isElement } from './types';

export const ELEMENTS: ElementData[] = [
  { number: 1, symbol: 'H', name: '氢 (Hydrogen)', category: ElementCategory.Nonmetal, atomicMass: "1.008", summary: "宇宙中最丰富的元素。", electronConfiguration: "1s1" },
  { number: 2, symbol: 'He', name: '氦 (Helium)', category: ElementCategory.NobleGas, atomicMass: "4.0026", summary: "第二轻的元素，惰性气体。", electronConfiguration: "1s2" },
  { number: 3, symbol: 'Li', name: '锂 (Lithium)', category: ElementCategory.AlkaliMetal, atomicMass: "6.94", summary: "最轻的金属，用于电池。", electronConfiguration: "[He] 2s1" },
  { number: 4, symbol: 'Be', name: '铍 (Beryllium)', category: ElementCategory.AlkalineEarthMetal, atomicMass: "9.0122", summary: "稀有金属，质硬。", electronConfiguration: "[He] 2s2" },
  { number: 5, symbol: 'B', name: '硼 (Boron)', category: ElementCategory.Metalloid, atomicMass: "10.81", summary: "关键的植物营养素。", electronConfiguration: "[He] 2s2 2p1" },
  { number: 6, symbol: 'C', name: '碳 (Carbon)', category: ElementCategory.Nonmetal, atomicMass: "12.011", summary: "生命的基础元素。", electronConfiguration: "[He] 2s2 2p2" },
  { number: 7, symbol: 'N', name: '氮 (Nitrogen)', category: ElementCategory.Nonmetal, atomicMass: "14.007", summary: "空气的主要成分 (78%)。", electronConfiguration: "[He] 2s2 2p3" },
  { number: 8, symbol: 'O', name: '氧 (Oxygen)', category: ElementCategory.Nonmetal, atomicMass: "15.999", summary: "呼吸和燃烧所必需。", electronConfiguration: "[He] 2s2 2p4" },
  { number: 9, symbol: 'F', name: '氟 (Fluorine)', category: ElementCategory.Halogen, atomicMass: "18.998", summary: "电负性最强的元素。", electronConfiguration: "[He] 2s2 2p5" },
  { number: 10, symbol: 'Ne', name: '氖 (Neon)', category: ElementCategory.NobleGas, atomicMass: "20.180", summary: "用于霓虹灯。", electronConfiguration: "[He] 2s2 2p6" },
  { number: 11, symbol: 'Na', name: '钠 (Sodium)', category: ElementCategory.AlkaliMetal, atomicMass: "22.990", summary: "软金属，食盐主要成分。", electronConfiguration: "[Ne] 3s1" },
  { number: 12, symbol: 'Mg', name: '镁 (Magnesium)', category: ElementCategory.AlkalineEarthMetal, atomicMass: "24.305", summary: "燃烧时发出强白光。", electronConfiguration: "[Ne] 3s2" },
  { number: 13, symbol: 'Al', name: '铝 (Aluminium)', category: ElementCategory.PostTransitionMetal, atomicMass: "26.982", summary: "地壳中含量最丰富的金属。", electronConfiguration: "[Ne] 3s2 3p1" },
  { number: 14, symbol: 'Si', name: '硅 (Silicon)', category: ElementCategory.Metalloid, atomicMass: "28.085", summary: "半导体工业的基础。", electronConfiguration: "[Ne] 3s2 3p2" },
  { number: 15, symbol: 'P', name: '磷 (Phosphorus)', category: ElementCategory.Nonmetal, atomicMass: "30.974", summary: "存在于DNA和细胞膜中。", electronConfiguration: "[Ne] 3s2 3p3" },
  { number: 16, symbol: 'S', name: '硫 (Sulfur)', category: ElementCategory.Nonmetal, atomicMass: "32.06", summary: "黄色固体，有刺激性气味。", electronConfiguration: "[Ne] 3s2 3p4" },
  { number: 17, symbol: 'Cl', name: '氯 (Chlorine)', category: ElementCategory.Halogen, atomicMass: "35.45", summary: "用于消毒和制造PVC。", electronConfiguration: "[Ne] 3s2 3p5" },
  { number: 18, symbol: 'Ar', name: '氩 (Argon)', category: ElementCategory.NobleGas, atomicMass: "39.948", summary: "最常见的惰性气体。", electronConfiguration: "[Ne] 3s2 3p6" },
  { number: 19, symbol: 'K', name: '钾 (Potassium)', category: ElementCategory.AlkaliMetal, atomicMass: "39.098", summary: "维持神经和肌肉功能。", electronConfiguration: "[Ar] 4s1" },
  { number: 20, symbol: 'Ca', name: '钙 (Calcium)', category: ElementCategory.AlkalineEarthMetal, atomicMass: "40.078", summary: "骨骼和牙齿的主要成分。", electronConfiguration: "[Ar] 4s2" },
  { number: 25, symbol: 'Mn', name: '锰 (Manganese)', category: ElementCategory.TransitionMetal, atomicMass: "54.938", summary: "钢的重要添加剂，生物酶成分。", electronConfiguration: "[Ar] 3d5 4s2" },
  { number: 26, symbol: 'Fe', name: '铁 (Iron)', category: ElementCategory.TransitionMetal, atomicMass: "55.845", summary: "使用最广泛的金属，血红蛋白成分。", electronConfiguration: "[Ar] 3d6 4s2" },
  { number: 29, symbol: 'Cu', name: '铜 (Copper)', category: ElementCategory.TransitionMetal, atomicMass: "63.546", summary: "优良的导电体，古老的金属。", electronConfiguration: "[Ar] 3d10 4s1" },
  { number: 30, symbol: 'Zn', name: '锌 (Zinc)', category: ElementCategory.TransitionMetal, atomicMass: "65.38", summary: "防腐镀层，人体必需微量元素。", electronConfiguration: "[Ar] 3d10 4s2" },
  { number: 47, symbol: 'Ag', name: '银 (Silver)', category: ElementCategory.TransitionMetal, atomicMass: "107.87", summary: "导电性最好的金属。", electronConfiguration: "[Kr] 4d10 5s1" },
  { number: 78, symbol: 'Pt', name: '铂 (Platinum)', category: ElementCategory.TransitionMetal, atomicMass: "195.08", summary: "稀有贵金属，优良催化剂。", electronConfiguration: "[Xe] 4f14 5d9 6s1" },
  { number: 79, symbol: 'Au', name: '金 (Gold)', category: ElementCategory.TransitionMetal, atomicMass: "196.97", summary: "延展性最好的金属，货币象征。", electronConfiguration: "[Xe] 4f14 5d10 6s1" },
];

export const COMPOUNDS: CompoundData[] = [
  // Oxides (Inorganic / Oxide)
  { formula: "H₂O", name: "水 (Water)", category: "Inorganic", molarMass: "18.015", summary: "生命之源，通用溶剂。" },
  { formula: "H₂O₂", name: "过氧化氢 (Hydrogen Peroxide)", category: "Oxide", molarMass: "34.01", summary: "强氧化剂，医疗消毒（双氧水）。" },
  { formula: "CO", name: "一氧化碳 (Carbon Monoxide)", category: "Oxide", molarMass: "28.01", summary: "无色无味有毒气体，燃烧不充分产物。" },
  { formula: "CO₂", name: "二氧化碳 (Carbon Dioxide)", category: "Oxide", molarMass: "44.01", summary: "温室气体，植物光合作用原料。" },
  { formula: "NO", name: "一氧化氮 (Nitric Oxide)", category: "Oxide", molarMass: "30.01", summary: "无色气体，遇空气变红棕色，信使分子。" },
  { formula: "NO₂", name: "二氧化氮 (Nitrogen Dioxide)", category: "Oxide", molarMass: "46.01", summary: "红棕色有毒气体，光化学烟雾成分。" },
  { formula: "SO₂", name: "二氧化硫 (Sulfur Dioxide)", category: "Oxide", molarMass: "64.06", summary: "无色有刺激性气味气体，导致酸雨。" },
  { formula: "SO₃", name: "三氧化硫 (Sulfur Trioxide)", category: "Oxide", molarMass: "80.06", summary: "严重腐蚀性，硫酸的酸酐。" },
  { formula: "SiO₂", name: "二氧化硅 (Silicon Dioxide)", category: "Oxide", molarMass: "60.08", summary: "石英、沙子、光导纤维的主要成分。" },
  { formula: "P₂O₅", name: "五氧化二磷 (Phosphorus Pentoxide)", category: "Oxide", molarMass: "141.94", summary: "极强的吸水性，常用作干燥剂。" },
  { formula: "Na₂O", name: "氧化钠 (Sodium Oxide)", category: "Oxide", molarMass: "61.98", summary: "碱性氧化物，遇水生成氢氧化钠。" },
  { formula: "CaO", name: "氧化钙 (Calcium Oxide)", category: "Oxide", molarMass: "56.08", summary: "生石灰，遇水放热，常用干燥剂。" },
  { formula: "MgO", name: "氧化镁 (Magnesium Oxide)", category: "Oxide", molarMass: "40.30", summary: "白色粉末，耐火材料，抗酸药。" },
  { formula: "Al₂O₃", name: "氧化铝 (Aluminium Oxide)", category: "Oxide", molarMass: "101.96", summary: "刚玉主要成分，硬度高，两性氧化物。" },
  { formula: "MnO₂", name: "二氧化锰 (Manganese Dioxide)", category: "Oxide", molarMass: "86.94", summary: "黑色粉末，实验室制氧气常用催化剂。" },
  { formula: "FeO", name: "氧化亚铁 (Ferrous Oxide)", category: "Oxide", molarMass: "71.84", summary: "黑色粉末，不稳定。" },
  { formula: "Fe₂O₃", name: "氧化铁 (Iron(III) Oxide)", category: "Oxide", molarMass: "159.69", summary: "红棕色粉末，铁锈成分，红色颜料。" },
  { formula: "Fe₃O₄", name: "四氧化三铁 (Iron(II,III) Oxide)", category: "Oxide", molarMass: "231.53", summary: "黑色磁性晶体，磁铁矿。" },
  { formula: "CuO", name: "氧化铜 (Copper(II) Oxide)", category: "Oxide", molarMass: "79.55", summary: "黑色粉末，制造玻璃和陶瓷颜料。" },
  { formula: "Ag₂O", name: "氧化银 (Silver Oxide)", category: "Oxide", molarMass: "231.74", summary: "棕黑色粉末，用于纽扣电池。" },
  { formula: "HgO", name: "氧化汞 (Mercury(II) Oxide)", category: "Oxide", molarMass: "216.59", summary: "红色或黄色粉末，受热分解生成氧气。" },

  // Acids
  { formula: "HCl", name: "盐酸 (Hydrochloric Acid)", category: "Acid", molarMass: "36.46", summary: "强酸，挥发性，胃酸的主要成分。" },
  { formula: "H₂SO₄", name: "硫酸 (Sulfuric Acid)", category: "Acid", molarMass: "98.08", summary: "强腐蚀性，吸水脱水性，工业之母。" },
  { formula: "HNO₃", name: "硝酸 (Nitric Acid)", category: "Acid", molarMass: "63.01", summary: "强氧化性酸，易挥发，见光分解。" },
  { formula: "CH₃COOH", name: "乙酸 (Acetic Acid)", category: "Acid", molarMass: "60.05", summary: "醋酸，食醋主要成分，弱酸，低温易凝固。" },
  { formula: "H₂CO₃", name: "碳酸 (Carbonic Acid)", category: "Acid", molarMass: "62.03", summary: "不稳定弱酸，存在于汽水中。" },
  { formula: "HF", name: "氢氟酸 (Hydrofluoric Acid)", category: "Acid", molarMass: "20.01", summary: "弱酸，能腐蚀雕刻玻璃。" },
  { formula: "H₂S", name: "氢硫酸 (Hydrosulfuric Acid)", category: "Acid", molarMass: "34.08", summary: "硫化氢的水溶液，有臭鸡蛋气味，剧毒。" },

  // Bases
  { formula: "NaOH", name: "氢氧化钠 (Sodium Hydroxide)", category: "Base", molarMass: "40.00", summary: "烧碱、火碱，强碱，易潮解，去除油污。" },
  { formula: "KOH", name: "氢氧化钾 (Potassium Hydroxide)", category: "Base", molarMass: "56.11", summary: "苛性钾，强碱，用于电池。" },
  { formula: "Ca(OH)₂", name: "氢氧化钙 (Calcium Hydroxide)", category: "Base", molarMass: "74.09", summary: "熟石灰，微溶，水溶液为澄清石灰水。" },
  { formula: "Mg(OH)₂", name: "氢氧化镁 (Magnesium Hydroxide)", category: "Base", molarMass: "58.32", summary: "难溶于水，常用作抗酸药、阻燃剂。" },
  { formula: "Al(OH)₃", name: "氢氧化铝 (Aluminium Hydroxide)", category: "Base", molarMass: "78.00", summary: "白色胶状沉淀，两性氢氧化物。" },
  { formula: "Fe(OH)₃", name: "氢氧化铁 (Iron(III) Hydroxide)", category: "Base", molarMass: "106.87", summary: "红褐色沉淀。" },
  { formula: "Cu(OH)₂", name: "氢氧化铜 (Copper(II) Hydroxide)", category: "Base", molarMass: "97.56", summary: "蓝色絮状沉淀。" },
  { formula: "NH₃·H₂O", name: "氨水 (Ammonia Water)", category: "Base", molarMass: "35.04", summary: "一水合氨，弱碱性，易挥发。" },

  // Salts
  { formula: "NaCl", name: "氯化钠 (Sodium Chloride)", category: "Salt", molarMass: "58.44", summary: "食盐主要成分，生理盐水。" },
  { formula: "Na₂CO₃", name: "碳酸钠 (Sodium Carbonate)", category: "Salt", molarMass: "105.99", summary: "纯碱，苏打，广泛用于玻璃、洗涤剂。" },
  { formula: "NaHCO₃", name: "碳酸氢钠 (Sodium Bicarbonate)", category: "Salt", molarMass: "84.01", summary: "小苏打，发酵粉，治疗胃酸过多。" },
  { formula: "Na₂SO₄", name: "硫酸钠 (Sodium Sulfate)", category: "Salt", molarMass: "142.04", summary: "白色粉末，十水合物俗称芒硝。" },
  { formula: "CaCO₃", name: "碳酸钙 (Calcium Carbonate)", category: "Salt", molarMass: "100.09", summary: "大理石、石灰石成分，补钙剂。" },
  { formula: "KNO₃", name: "硝酸钾 (Potassium Nitrate)", category: "Salt", molarMass: "101.10", summary: "黑火药原料，复合肥料。" },
  { formula: "KCl", name: "氯化钾 (Potassium Chloride)", category: "Salt", molarMass: "74.55", summary: "常用钾肥，死海盐分。" },
  { formula: "NaNO₃", name: "硝酸钠 (Sodium Nitrate)", category: "Salt", molarMass: "84.99", summary: "智利硝石，工业原料。" },
  { formula: "CaCl₂", name: "氯化钙 (Calcium Chloride)", category: "Salt", molarMass: "110.98", summary: "吸湿性强，干燥剂，融雪剂。" },
  { formula: "BaCl₂", name: "氯化钡 (Barium Chloride)", category: "Salt", molarMass: "208.23", summary: "剧毒，用于鉴别硫酸根离子。" },
  { formula: "BaSO₄", name: "硫酸钡 (Barium Sulfate)", category: "Salt", molarMass: "233.39", summary: "钡餐，白色沉淀，不溶于酸，用于医疗造影。" },
  { formula: "FeCl₂", name: "氯化亚铁 (Iron(II) Chloride)", category: "Salt", molarMass: "126.75", summary: "浅绿色溶液，具有还原性。" },
  { formula: "FeCl₃", name: "氯化铁 (Iron(III) Chloride)", category: "Salt", molarMass: "162.20", summary: "棕黄色溶液，用于蚀刻电路板，净水。" },
  { formula: "FeSO₄", name: "硫酸亚铁 (Ferrous Sulfate)", category: "Salt", molarMass: "151.91", summary: "浅绿色晶体，俗称绿矾，补铁剂。" },
  { formula: "CuSO₄", name: "硫酸铜 (Copper(II) Sulfate)", category: "Salt", molarMass: "159.61", summary: "白色粉末，吸水后变蓝。" },
  { formula: "CuSO₄·5H₂O", name: "五水硫酸铜 (Copper Sulfate Pentahydrate)", category: "Salt", molarMass: "249.68", summary: "蓝色晶体，俗称胆矾、蓝矾。" },
  { formula: "AgNO₃", name: "硝酸银 (Silver Nitrate)", category: "Salt", molarMass: "169.87", summary: "用于检验氯离子，制镜，见光易分解。" },
  { formula: "AgCl", name: "氯化银 (Silver Chloride)", category: "Salt", molarMass: "143.32", summary: "白色沉淀，不溶于酸，感光材料。" },
  { formula: "KMnO₄", name: "高锰酸钾 (Potassium Permanganate)", category: "Salt", molarMass: "158.03", summary: "紫黑色固体，强氧化剂，消毒防腐。" },
  { formula: "K₂MnO₄", name: "锰酸钾 (Potassium Manganate)", category: "Salt", molarMass: "197.13", summary: "墨绿色晶体，高锰酸钾分解的中间产物。" },
  { formula: "KClO₃", name: "氯酸钾 (Potassium Chlorate)", category: "Salt", molarMass: "122.55", summary: "强氧化剂，受热分解产生氧气，用于制造烟花和火柴。" },
  { formula: "NH₄Cl", name: "氯化铵 (Ammonium Chloride)", category: "Salt", molarMass: "53.49", summary: "氮肥，干电池电解质，焊药。" },
  { formula: "NH₄NO₃", name: "硝酸铵 (Ammonium Nitrate)", category: "Salt", molarMass: "80.04", summary: "常用氮肥，受热或撞击易爆炸。" },

  // Organics
  { formula: "CH₄", name: "甲烷 (Methane)", category: "Organic", molarMass: "16.04", summary: "天然气、沼气主要成分，最简单的有机物。" },
  { formula: "C₂H₅OH", name: "乙醇 (Ethanol)", category: "Organic", molarMass: "46.07", summary: "酒精，消毒剂，生物燃料。" },
  { formula: "C₆H₁₂O₆", name: "葡萄糖 (Glucose)", category: "Organic", molarMass: "180.16", summary: "生物体主要供能物质，血糖。" },
  { formula: "C₁₂H₂₂O₁₁", name: "蔗糖 (Sucrose)", category: "Organic", molarMass: "342.30", summary: "日常食用的白糖、红糖，二糖。" },
  { formula: "(C₆H₁₀O₅)n", name: "淀粉 (Starch)", category: "Organic", molarMass: "162.14*n", summary: "多糖，植物光合作用产物，遇碘变蓝。" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  [ElementCategory.Nonmetal]: 'bg-blue-500 border-blue-400',
  [ElementCategory.NobleGas]: 'bg-indigo-500 border-indigo-400',
  [ElementCategory.AlkaliMetal]: 'bg-red-500 border-red-400',
  [ElementCategory.AlkalineEarthMetal]: 'bg-orange-500 border-orange-400',
  [ElementCategory.Metalloid]: 'bg-teal-500 border-teal-400',
  [ElementCategory.Halogen]: 'bg-cyan-500 border-cyan-400',
  [ElementCategory.PostTransitionMetal]: 'bg-green-500 border-green-400',
  [ElementCategory.TransitionMetal]: 'bg-yellow-500 border-yellow-400',
  [ElementCategory.Lanthanide]: 'bg-pink-500 border-pink-400',
  [ElementCategory.Actinide]: 'bg-purple-500 border-purple-400',
  [ElementCategory.Unknown]: 'bg-gray-500 border-gray-400',
  // Compound Categories
  "Inorganic": "bg-sky-500 border-sky-400",
  "Oxide": "bg-slate-500 border-slate-400",
  "Salt": "bg-emerald-500 border-emerald-400",
  "Acid": "bg-rose-500 border-rose-400",
  "Base": "bg-violet-500 border-violet-400",
  "Organic": "bg-amber-500 border-amber-400",
};

export const SAMPLE_QUESTIONS = [
  "告诉我关于这个物质的有趣事实。",
  "它能和什么发生反应？",
  "这个物质在生活中有哪些应用？",
  "解释它的化学性质。"
];

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'bg-gray-500 border-gray-400';
}
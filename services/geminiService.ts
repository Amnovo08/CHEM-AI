import { GoogleGenAI } from "@google/genai";
import { ChatMessage, ChemicalItem, isElement } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction to guide the AI's persona
const SYSTEM_INSTRUCTION = `
你是一位热情、博学且有趣的化学老师，名叫"ChemBot"。
你的目标是帮助学生学习化学元素、化合物、分子和反应。
1. 回答要准确，但语言要生动，适合学生理解。
2. 使用Markdown格式化你的回答（例如使用加粗、列表）。
3. 如果用户正在查看某个特定元素或化合物，请尽量结合该物质进行回答。
4. 鼓励用户进行探索。
5. 保持回答简洁，除非用户要求详细解释。
6. 【关键】如果你在解释一种常见分子（如 H2O, CO2, CH4, NH3, NaCl, HCl, O2）的结构、形状或组成时，请在回答的最后一行添加一个特殊的标记：[VISUALIZE: 分子式]。
   例如："[VISUALIZE: H2O]" 或 "[VISUALIZE: CO2]"。这将在界面上触发一个3D动画展示。不要在其他地方使用这个标记。
`;

export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[],
  contextItem: ChemicalItem | null
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';

    // Construct a context-aware prompt
    let prompt = message;
    if (contextItem) {
      const identifier = isElement(contextItem) ? contextItem.symbol : contextItem.formula;
      prompt = `[当前选中的物质: ${contextItem.name} (${identifier})] ${message}`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "抱歉，我无法生成回答。";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，连接AI助手时出现错误。请检查您的网络或稍后再试。";
  }
};

export const analyzeReaction = async (reactants: ChemicalItem[], condition: string): Promise<string> => {
  try {
    const reactantsList = reactants.map(item => {
        const id = isElement(item) ? item.symbol : item.formula;
        return `${item.name} (${id})`;
    }).join(", ");

    const prompt = `
    用户将以下物质放入了反应容器中: [ ${reactantsList} ]。
    设定的反应条件是: "${condition || "无特殊条件"}"。

    请分析可能发生的化学反应：
    1. 判断这些物质在给定条件下是否会发生化学反应。
    2. 如果发生反应，请提供**严格配平**的化学方程式。
    3. 描述反应现象（如颜色变化、气泡、沉淀、发光发热等）。
    4. 如果不反应，解释原因（或描述物理混合现象，如溶解）。
    5. 如果有多个可能的反应，请选择最主要的一个。

    请严格用JSON格式返回，不要包含Markdown代码块标记。JSON格式如下：
    {
      "equation": "配平的化学方程式 (例如: 2H₂ + O₂ → 2H₂O) 或 '无反应'",
      "description": "详细的现象描述，包括颜色、状态变化等。",
      "type": "反应类型 (如: 置换反应、中和反应) 或 '物理混合'/'无'"
    }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Gemini Reaction Analysis Error:", error);
    return JSON.stringify({
      equation: "错误",
      description: "无法分析反应，请稍后再试。",
      type: "Unknown"
    });
  }
};
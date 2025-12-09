import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChemicalItem, isElement } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { SAMPLE_QUESTIONS } from '../constants';
import MoleculeVisualizer from './MoleculeVisualizer';

interface ChatInterfaceProps {
  selectedItem: ChemicalItem | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedItem }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '你好！我是你的AI化学助手 ChemBot。点击左侧的物质，或者直接问我任何化学问题！🧪',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(text, messages, selectedItem);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: '出错了，请稍后再试。',
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const identifier = selectedItem ? (isElement(selectedItem) ? selectedItem.symbol : selectedItem.formula) : '';

  // Helper to parse message for visualization tags
  const renderMessageContent = (text: string) => {
    // Regex to find [VISUALIZE: Formula]
    const visualRegex = /\[VISUALIZE:\s*(.*?)\]/;
    const match = text.match(visualRegex);
    
    if (match) {
        const formula = match[1];
        const cleanText = text.replace(match[0], '').trim();
        return (
            <div>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
                    __html: cleanText
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>') 
                }} />
                <MoleculeVisualizer formula={formula} />
            </div>
        );
    }

    return (
        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ 
            __html: text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br/>') 
        }} />
    );
  };

  return (
    <div className="flex flex-col h-[600px] glass-panel rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="font-bold text-white flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
           </svg>
           AI 实验室助手
        </h2>
        {selectedItem && (
            <span className="text-xs bg-slate-700 px-2 py-1 rounded-full text-blue-300 border border-blue-500/30">
                当前焦点: {identifier}
            </span>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-700 text-gray-100 rounded-tl-none border border-slate-600'
              }`}
            >
              {renderMessageContent(msg.text)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-2xl rounded-tl-none p-3 border border-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions (Quick Prompts) */}
      <div className="p-2 bg-slate-800 border-t border-slate-700 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex gap-2">
             {SAMPLE_QUESTIONS.map((q, idx) => (
                 <button 
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-cyan-300 px-3 py-1.5 rounded-full border border-slate-600 transition-colors"
                 >
                    {q}
                 </button>
             ))}
          </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedItem ? `问问关于 ${selectedItem.name} 的问题...` : "输入化学问题..."}
            className="flex-1 bg-slate-900 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
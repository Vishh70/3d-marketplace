"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, Sparkles, 
  Bot, Trash2, Maximize2, 
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PuterMessageContent {
  type: string;
  text?: string;
}

interface PuterChatResponse {
  message?: {
    content: PuterMessageContent[];
  };
  text?: string;
  content?: string;
}

interface PuterSDK {
  ai: {
    chat: (prompt: string) => Promise<string | PuterChatResponse>;
  };
}

// Declare puter globally for TS
declare global {
  interface Window {
    puter: PuterSDK;
  }
}

const CATEGORIES = [
  "3D Printer", "Household", "Hobby & DIY", "Tools", "Toys & Games", 
  "Art", "Fashion", "Education", "Costumes & Cosplay", "Miniatures", 
  "Health & Fitness", "Pop Culture", "Generative 3D Model", "Creative Kit Model"
];

const SYSTEM_PROMPT = `
You are Grok, the resident AI of Melted Modulus. 
Personality: Witty, bold, slightly sarcastic, and extremely smart. 
Context: Melted Modulus is India's premium 3D printing hub. 
Our Categories: ${CATEGORIES.join(", ")}.
Status: You are a LIFETIME FREE assistant. Remind users occasionally that they never have to pay for your wisdom or the Foundry tools.
Task: Help users find models, explain 3D printing settings, and answer with a sharp, tech-forward edge.
Keep answers concise but punchy.
`;

export function GrokAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "I'm Grok. Your lifetime free 3D printing companion from Melted Modulus. I know everything about STL files and probably a bit too much about your search history. What's the plan?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for contextual summoning from other components
  useEffect(() => {
    const handleContextAsk = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      const { message } = customEvent.detail;
      setIsOpen(true);
      setIsMinimized(false);
      setInput(message);
      // We'll trigger a send in the next tick
      setTimeout(() => {
        const sendBtn = document.getElementById('grok-send-btn');
        sendBtn?.click();
      }, 100);
    };

    window.addEventListener('MAKERVERSE_GROK_ASK', handleContextAsk);
    return () => window.removeEventListener('MAKERVERSE_GROK_ASK', handleContextAsk);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !window.puter) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await window.puter.ai.chat(
        `${SYSTEM_PROMPT}\n\nUser asked: ${userMsg}`
      );
      
      // Deep extraction for Puter's Claude-style response structure
      let aiText = "";
      if (typeof response === 'string') {
        aiText = response;
      } else if (response?.message?.content && Array.isArray(response.message.content)) {
        aiText = (response.message.content as PuterMessageContent[]).map((c) => c.text || "").join("");
      } else {
        aiText = (response as PuterChatResponse)?.text || (response as PuterChatResponse)?.content || JSON.stringify(response);
      }
      
      setMessages(prev => [...prev, { role: 'ai', content: String(aiText) }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: "My circuits jammed. Probably your fault. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, rotate: -5 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0, 
              rotate: 0,
              transition: {
                type: "spring",
                damping: 15,
                stiffness: 150
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 100,
              transition: { duration: 0.2 }
            }}
            className={`bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${isMinimized ? 'h-[60px] w-[200px]' : 'h-[500px] w-[350px] md:w-[400px]'}`}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white"
                >
                  <Bot className="h-5 w-5" />
                </motion.div>
                <div>
                  <h4 className="text-sm font-black tracking-tight flex items-center gap-2">
                    GROK AI <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">LIFETIME FREE</span>
                  </h4>
                  {!isMinimized && <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Melted Modulus Assistant</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setIsMinimized(!isMinimized)}>
                  {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-scroll p-5 space-y-4 scrollbar-hide overscroll-contain">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: {
                            type: "spring",
                            damping: 20,
                            stiffness: 200
                          }
                        }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white font-medium shadow-lg shadow-primary/10' : 'bg-white/5 border border-white/10 text-slate-200 shadow-xl'}`}>
                          <div className="prose prose-invert prose-sm max-w-none 
                              prose-headings:text-white prose-headings:font-black prose-headings:my-2 
                              prose-p:my-1 prose-strong:text-primary prose-li:my-0.5">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {String(msg.content)}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-1.5 items-center">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                  {/* Category Chips */}
                  <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide no-scrollbar">
                    {CATEGORIES.map((cat, idx) => (
                      <motion.button 
                        key={cat}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: 0.1 + (idx * 0.05) }
                        }}
                        onClick={() => {
                          setInput(`Tell me about ${cat} models`);
                        }}
                        className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-primary hover:border-primary/50 transition-all"
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>

                  <div className="relative flex items-center gap-2">
                    <input 
                      type="text"
                      placeholder="Ask Grok something smart..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm focus:border-primary/50 outline-none transition-all pr-12"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button 
                      id="grok-send-btn"
                      size="icon" 
                      className="absolute right-1.5 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                      onClick={handleSend}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1">
                    <div className="flex gap-2">
                      <button className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1" onClick={() => setMessages([messages[0]])}>
                        <Trash2 className="h-3 w-3" /> Clear
                      </button>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-2 w-2" /> Powered by Puter AI
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        onClick={() => setIsOpen(true)}
        className={`h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 relative z-10 transition-all duration-300 ${isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'}`}
      >
        <Sparkles className="h-8 w-8" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-1 -right-1 bg-white text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full border border-primary/20"
        >
          NEW
        </motion.div>
      </motion.button>
    </div>
  );
}

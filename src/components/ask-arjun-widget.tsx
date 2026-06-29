"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, MessageSquare, X, Send, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "arjun";
  text: string;
  timestamp: Date;
}

const PRESETS = [
  "Who is Arjun?",
  "What is your tech stack?",
  "Can you mentor me?",
  "Are you available for freelance work?",
  "What is Velvetbyte?",
];

const RESPONSES: Record<string, string> = {
  "who is arjun?": "I'm a web developer by profession and a mentor by passion. I didn't start in tech—I was an ITI student, cashier, and marketing manager before teaching myself coding. Today, I build custom applications and help others transition into digital careers.",
  "what is your tech stack?": "My primary stack includes Next.js, React, TypeScript, Tailwind CSS, WordPress (custom theme/plugin OOP development), and Shopify. I also run AI integrations and automation experiments.",
  "can you mentor me?": "I would love to! I help beginners and career changers master WordPress, Shopify, and modern web development through real-world builds. Head over to my /mentorship page to run the Mentor Mode helper and book a slot!",
  "are you available for freelance work?": "Yes! I collaborate with startups, agencies, and brands on web projects. I specialize in custom WordPress, Shopify, and interactive landing pages. Drop me a message on the /contact page, and let's build something meaningful.",
  "what is velvetbyte?": "Velvetbyte is my design and development venture where we build premium digital products, templates, and high-end web experiences for clients.",
  "hello": "Hey there! Ask me anything about my journey, web development, mentorship, or what I'm currently building.",
  "hi": "Hey there! Ask me anything about my journey, web development, mentorship, or what I'm currently building.",
};

export default function AskArjunWidget({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "arjun",
      text: "Hey! I'm Arjun. Ask me anything about my career path, mentorship program, workspace, or web projects. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const cleanText = text.toLowerCase().trim().replace(/[?.!]/g, "");
      let reply = "That's a great question! I'm not fully sure how to answer that yet, but you can schedule a direct call with me on my /contact page, or email me at contact@arjundev.in!";
      
      // Basic match search
      for (const [key, value] of Object.entries(RESPONSES)) {
        if (cleanText.includes(key) || key.includes(cleanText)) {
          reply = value;
          break;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "arjun",
          text: reply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center cursor-pointer border border-blue-500/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layoutId="ask-arjun-button"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="w-6 h-6" key="close" />
          ) : (
            <div className="flex items-center gap-2 px-1" key="chat">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs font-semibold select-none hidden sm:inline-block">Ask Arjun</span>
            </div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-40 w-[92vw] sm:w-[380px] h-[520px] glassmorphism rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/60 dark:border-slate-800/60"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-600 font-bold flex items-center justify-center text-sm border-2 border-white/20">
                    AJ
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Arjun (AI Twin)</h3>
                  <p className="text-[10px] text-emerald-400 font-medium">Online &bull; Ask a question</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Presets Grid */}
            {messages.length === 1 && (
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
                <p className="text-[10px] text-slate-400 font-semibold mb-2 uppercase tracking-wide">Suggested questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSend(preset)}
                      className="text-xs px-2.5 py-1.5 rounded-full border border-slate-200 hover:border-blue-500 dark:border-slate-800 dark:hover:border-blue-400 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about career, stacks, projects..."
                className="flex-1 py-2 px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

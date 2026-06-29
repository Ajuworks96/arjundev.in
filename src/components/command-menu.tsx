"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import { 
  Search, Moon, Sun, Home, Briefcase, GraduationCap, 
  FileText, Video, Calendar, Mail, Sparkles 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandMenu({ 
  open, 
  setOpen,
  onOpenAI
}: { 
  open: boolean; 
  setOpen: (open: boolean) => void;
  onOpenAI?: () => void;
}) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setSearch("");
    }
  }, [open]);

  const items: CommandItem[] = [
    {
      id: "home",
      title: "Home",
      subtitle: "Back to the start",
      icon: <Home className="w-4 h-4" />,
      action: () => { router.push("/"); setOpen(false); }
    },
    {
      id: "journey",
      title: "Journey & Story",
      subtitle: "My path from Cashier to Mentor",
      icon: <Briefcase className="w-4 h-4" />,
      action: () => { router.push("/journey"); setOpen(false); }
    },
    {
      id: "projects",
      title: "Case Studies & Work",
      subtitle: "Premium web & brand designs",
      icon: <FileText className="w-4 h-4" />,
      action: () => { router.push("/projects"); setOpen(false); }
    },
    {
      id: "mentorship",
      title: "Mentorship Hub",
      subtitle: "Practical web development training",
      icon: <GraduationCap className="w-4 h-4" />,
      action: () => { router.push("/mentorship"); setOpen(false); }
    },
    {
      id: "notes",
      title: "Notes & Writings",
      subtitle: "Weekly articles, lessons, and guides",
      icon: <FileText className="w-4 h-4" />,
      action: () => { router.push("/notes"); setOpen(false); }
    },
    {
      id: "media",
      title: "Media Wall",
      subtitle: "Videos, Reels, and tutorials",
      icon: <Video className="w-4 h-4" />,
      action: () => { router.push("/media"); setOpen(false); }
    },
    {
      id: "now",
      title: "Now Page",
      subtitle: "What I'm building, reading, and learning this week",
      icon: <Calendar className="w-4 h-4" />,
      action: () => { router.push("/now"); setOpen(false); }
    },
    {
      id: "contact",
      title: "Contact",
      subtitle: "Book a call, WhatsApp, or drop an email",
      icon: <Mail className="w-4 h-4" />,
      action: () => { router.push("/contact"); setOpen(false); }
    },
    {
      id: "ai",
      title: "Ask Arjun AI",
      subtitle: "Chat with my virtual double",
      icon: <Sparkles className="w-4 h-4 text-blue-500" />,
      action: () => { 
        setOpen(false); 
        if (onOpenAI) onOpenAI();
      }
    },
    {
      id: "theme",
      title: `Switch to ${theme === "light" ? "Dark" : "Light"} Mode`,
      subtitle: "Toggle visual style",
      icon: theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />,
      action: () => { toggleTheme(); setOpen(false); }
    }
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg glassmorphism rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/50"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input wrapper */}
            <div className="flex items-center px-4 border-b border-slate-200/50 dark:border-slate-800/50">
              <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                placeholder="Search journey, projects, mentorship, or type a command..."
                className="w-full py-4 bg-transparent outline-none border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm"
              />
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md border border-slate-200/50 dark:border-slate-700/50 select-none">ESC</span>
            </div>

            {/* Suggestions list */}
            <div className="max-h-[360px] overflow-y-auto p-2 no-scrollbar">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center text-left px-3 py-2.5 rounded-xl transition-all duration-150 ${
                        isSelected 
                          ? "bg-blue-600 text-white dark:bg-blue-600" 
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 flex-shrink-0 ${
                        isSelected 
                          ? "bg-blue-500 text-white" 
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className={`text-xs truncate ${
                          isSelected ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                        }`}>{item.subtitle}</p>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] text-blue-100 font-semibold bg-blue-700 px-2 py-0.5 rounded">Enter</span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No results found for &ldquo;{search}&rdquo;
                </div>
              )}
            </div>

            {/* Quick Footer info */}
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50 text-[10px] text-slate-400 select-none">
              <span className="flex items-center gap-1">
                Use <span className="font-semibold px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200/50 dark:border-slate-700/50">↑↓</span> to navigate
              </span>
              <span className="flex items-center gap-1">
                Press <span className="font-semibold px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200/50 dark:border-slate-700/50">⌘K</span> to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

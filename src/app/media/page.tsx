"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, Youtube, ExternalLink, Calendar, Instagram, Linkedin, Github, X } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  category: "YouTube" | "Reels" | "Talks";
  date: string;
  duration: string;
  url: string;
  description: string;
}

const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "wp-tutorial",
    title: "How to Build a Custom WordPress Theme (OOP Boilerplate)",
    category: "YouTube",
    date: "May 15, 2026",
    duration: "42:15",
    url: "https://youtube.com",
    description: "An in-depth coding guide building a WordPress theme with modern PHP namespaces, separate view scripts, and custom tailwind setups."
  },
  {
    id: "cashier-mindset",
    title: "The Cashier to Developer Transition Mindset",
    category: "Reels",
    date: "Jun 02, 2026",
    duration: "0:58",
    url: "https://instagram.com/arjundev.in",
    description: "A short clip on how to manage cognitive fatigue, study effectively after long work shifts, and maintain consistency."
  },
  {
    id: "nextjs-shopify",
    title: "Speed Audits: Building a Headless Shopify Storefront",
    category: "YouTube",
    date: "Apr 29, 2026",
    duration: "28:40",
    url: "https://youtube.com",
    description: "Benchmarking standard liquid themes against custom next.js page setups, optimizing images, and syncing cart tokens."
  },
  {
    id: "wp-headless-talk",
    title: "WordPress in the Age of Headless Web & AI Engines",
    category: "Talks",
    date: "Mar 12, 2026",
    duration: "18:22",
    url: "https://youtube.com",
    description: "A conference talk examining how custom block structures and API layers keep WordPress competitive alongside modern JS frameworks."
  }
];

const SOCIAL_CHANNELS = [
  {
    name: "YouTube",
    subtitle: "Subscribe for tutorials",
    icon: <Youtube className="w-5 h-5 text-red-500" />,
    url: "https://youtube.com",
    description: "OOP WordPress coding, Shopify setup guides, and Next.js tutorials."
  },
  {
    name: "Instagram",
    subtitle: "Follow daily reels",
    icon: <Instagram className="w-5 h-5 text-pink-500" />,
    url: "https://instagram.com/arjundev.in",
    description: "Developer mindset clips, career transition advice, and Shopify store tricks."
  },
  {
    name: "LinkedIn",
    subtitle: "Let's connect",
    icon: <Linkedin className="w-5 h-5 text-sky-500" />,
    url: "https://linkedin.com",
    description: "Tech industry updates, client workflows, and personal brand insights."
  },
  {
    name: "GitHub",
    subtitle: "Clone repositories",
    icon: <Github className="w-5 h-5 text-white" />,
    url: "https://github.com/Ajuworks96",
    description: "Open-source boilerplate codes, Tailwind kits, and portfolio systems."
  }
];

export default function Media() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [mediaItems, setMediaItems] = useState<any[]>(MEDIA_ITEMS);
  const [loading, setLoading] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Helper to extract YouTube video ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    async function loadSocialFeed() {
      try {
        const res = await fetch("/api/social-feed");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setMediaItems(data);
          }
        }
      } catch (e) {
        console.error("Failed to load live social feed:", e);
      } finally {
        setLoading(false);
      }
    }
    loadSocialFeed();
  }, []);

  const filteredMedia = mediaItems.filter(item => 
    activeCategory === "All" || item.category === activeCategory
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-16">
      
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">MEDIA HUB</span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Media &amp; Video Library
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Watch code walkthroughs, design guides, and podcasts documenting the developer journey.
        </p>
      </section>

      {/* Social Platforms Connection Grid */}
      <section className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Connected Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOCIAL_CHANNELS.map((channel) => (
            <a
              key={channel.name}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glassmorphism p-5 rounded-2xl border border-slate-900/60 flex flex-col justify-between space-y-3 cursor-pointer transition-all duration-300 hover:bg-white hover:border-white hover:text-slate-950 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-slate-950/60 border border-slate-900 text-slate-550 rounded-xl group-hover:bg-slate-100 group-hover:border-slate-200 transition-colors">
                  {channel.icon}
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-700">Connect &rarr;</span>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-slate-950">{channel.name}</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-655 mt-0.5">{channel.subtitle}</p>
                <p className="text-[11px] text-slate-400 group-hover:text-slate-800 leading-relaxed mt-2">{channel.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Category filters */}
      <div className="flex gap-1.5 overflow-x-auto w-full no-scrollbar justify-start border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        {["All", "YouTube", "Reels", "LinkedIn", "Talks"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeCategory === cat
                ? "bg-[#ffff3f] text-slate-950 shadow-lg shadow-[#ffff3f]/10"
                : "bg-[#070b16]/60 border border-slate-900/60 hover:bg-white hover:text-slate-950 hover:border-white text-slate-350"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMedia.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="glassmorphism rounded-2xl border border-slate-900/60 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {/* Visual Header representing Video thumbnail */}
            <div className="aspect-video bg-slate-950 flex items-center justify-center relative group overflow-hidden">
              {item.thumbnail && (
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-slate-950/60 group-hover:bg-slate-950/30 transition-colors duration-300" />
              
              {/* Play icon overlay */}
              <button 
                onClick={() => {
                  const ytid = getYoutubeId(item.url);
                  if (item.category === "YouTube" && ytid) {
                    setActiveVideoId(ytid);
                  } else {
                    window.open(item.url, "_blank");
                  }
                }}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 z-10 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
              
              <span className="absolute bottom-3 right-3 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded font-bold z-10">{item.duration}</span>
              
              {/* Category indicator badge */}
              <span className="absolute top-3 left-3 text-[9px] bg-[#ffff3f] text-slate-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider z-10">
                {item.category}
              </span>
            </div>

            {/* Description Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-250/10 dark:border-slate-800/40">
                <button
                  onClick={() => {
                    const ytid = getYoutubeId(item.url);
                    if (item.category === "YouTube" && ytid) {
                      setActiveVideoId(ytid);
                    } else {
                      window.open(item.url, "_blank");
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-[#ffff3f] hover:bg-yellow-500 text-slate-950 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <span>{item.category === "YouTube" ? "Play Video" : "Open Post"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic YouTube Video Modal Player */}
      <AnimatePresence>
        {activeVideoId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveVideoId(null)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-white rounded-full transition-colors cursor-pointer"
                title="Close Player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* YouTube Player Iframe */}
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="YouTube Video Player"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

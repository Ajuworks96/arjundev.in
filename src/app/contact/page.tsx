"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Calendar, Linkedin, Instagram, ArrowRight, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "mentorship",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API request completion
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">
      
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-500">COLLABORATION PORTAL</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Let&apos;s Build Something Meaningful Together
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Have a question about code mentorship? Need a custom WordPress plugin, a high-converting Shopify store, or a technical consultation? Drop me a line below.
        </p>
      </section>

      {/* Main Grid: Form + Quick Channels */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-3xl mx-auto">
        
        {/* Left Column: Channels */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Channels</h3>
          
          {/* Cal.com booking */}
          <a
            href="https://cal.com/arjun-poa8ar/easy-to-learn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:border-[#ffff3f] hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-white">Book Diagnostic</p>
              <p className="text-[10px] text-slate-400 mt-0.5">30-min audit slot</p>
            </div>
          </a>

          {/* WhatsApp Chat */}
          <a
            href="https://wa.me/918921658090"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:border-emerald-500 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-white">WhatsApp Direct</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Instant chat routing</p>
            </div>
          </a>

          {/* Social icons dock */}
          <div className="glassmorphism p-4 rounded-2xl flex items-center justify-around">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="mailto:contact@arjundev.in" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glassmorphism p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-5"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>

                {/* Interest category selector */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">What are you looking to build?</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "mentorship", label: "Career Mentorship" },
                      { id: "wordpress", label: "Custom WordPress" },
                      { id: "shopify", label: "Shopify Store" },
                      { id: "other", label: "Other Project" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, interest: opt.id })}
                        className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                          formData.interest === opt.id
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-400 dark:hover:bg-slate-900"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Message Details</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me a bit about your background, project scope, or timeline..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold rounded-2xl shadow-md transition-colors cursor-pointer"
                  >
                    <span>Send Message Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.form>
            ) : (
              // Success Alert
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glassmorphism p-8 rounded-3xl border border-emerald-500/20 text-center space-y-4 shadow-xl"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Message Transmitted!</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Hey {formData.name}, I received your inquiry about {formData.interest === "other" ? "collaborating" : formData.interest}. I usually respond within 24 hours. Let&apos;s build something meaningful!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", interest: "mentorship", message: "" });
                    }}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/60 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

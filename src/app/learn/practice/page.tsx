"use client";

import { useState } from "react";
import { 
  Milestone, BookOpen, Settings, Layout, Layers, ShoppingBag, 
  Plus, CheckCircle2, ChevronRight, Award, HelpCircle, ArrowRight, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SimulatorsHub() {
  const [activeSimulator, setActiveSimulator] = useState<"hub" | "wordpress" | "shopify">("hub");
  
  // WordPress Simulator States
  const [wpStep, setWpStep] = useState(0); // 0: Home, 1: Plugins link, 2: Add New page, 3: Installed & Active
  const [showWpSuccess, setShowWpSuccess] = useState(false);

  // Shopify Simulator States
  const [shopifyStep, setShopifyStep] = useState(0); // 0: Home, 1: Products, 2: New Form, 3: Shipped
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [showShopifySuccess, setShowShopifySuccess] = useState(false);

  // Success XP handler
  const [showXpAlert, setShowXpAlert] = useState(false);

  const triggerXpAward = () => {
    setShowXpAlert(true);
    setTimeout(() => setShowXpAlert(false), 4000);
  };

  const resetWP = () => {
    setWpStep(0);
    setShowWpSuccess(false);
  };

  const resetShopify = () => {
    setShopifyStep(0);
    setProductName("");
    setProductPrice("");
    setShowShopifySuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#050912] text-slate-100 py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.05] grid-mask pointer-events-none" />

      {/* Floating XP Alert */}
      <AnimatePresence>
        {showXpAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2.5"
          >
            <Award className="w-5 h-5" />
            <span>Practice Task Complete! +25 XP Added.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Hub Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">Practice Simulators Hub</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              ഡാറ്റകൾ നഷ്ടപ്പെടുമെന്ന പേടിയില്ലാതെ സിമുലേറ്ററുകൾ ഉപയോഗിച്ച് കോഡിങ് പരിശീലിക്കാം.
            </p>
          </div>
          {activeSimulator !== "hub" && (
            <button
              onClick={() => setActiveSimulator("hub")}
              className="px-4 py-2 border border-slate-900 hover:border-slate-800 bg-[#070b16]/80 text-slate-350 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              &larr; Back to Simulators Hub
            </button>
          )}
        </section>

        {activeSimulator === "hub" && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            
            {/* WordPress Card */}
            <div className="glassmorphism p-6 rounded-3xl border border-slate-900/60 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">WordPress Simulator</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  വേർഡ്പ്രെസ്സ് പാനലിൽ പ്ലഗിനുകൾ ഇൻസ്റ്റാൾ ചെയ്യാനും പേജുകൾ നിർമ്മിക്കാനും പഠിക്കാം. പേടികൂടാതെ എന്ത് മാറ്റങ്ങളും ക്ലിക്ക് ചെയ്തു നോക്കാം!
                </p>
              </div>
              <button
                onClick={() => { resetWP(); setActiveSimulator("wordpress"); }}
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Launch WordPress Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Shopify Card */}
            <div className="glassmorphism p-6 rounded-3xl border border-slate-900/60 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Shopify Admin Simulator</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  ഇ-കൊമേഴ്‌സ് ഉല്പന്നങ്ങൾ ആഡ് ചെയ്യാനും മെനുകൾ ലിങ്ക് ചെയ്യാനും പരിശീലിക്കാം. പ്രൊഫഷണൽ സ്റ്റോർ കൺട്രോൾ ഡിസൈൻ ലളിതമായി മനസ്സിലാക്കാം.
                </p>
              </div>
              <button
                onClick={() => { resetShopify(); setActiveSimulator("shopify"); }}
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Launch Shopify Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </section>
        )}

        {/* WordPress Simulator layout */}
        {activeSimulator === "wordpress" && (
          <section className="space-y-6">
            
            {/* Guide Instructions panel */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-2xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">CURRENT ASSIGNMENT: Install &amp; Activate Plugin</p>
                <p className="text-slate-300 font-sans mt-0.5">
                  വേർഡ്പ്രെസ്സ് പ്ലഗിൻ ഡയറക്ടറിയിൽ നിന്ന് <b>Elementor Builder</b> പ്ലഗിൻ ഇൻസ്റ്റാൾ ചെയ്ത് ആക്റ്റിവേറ്റ് ചെയ്യുക എന്നതാണ് നിങ്ങളുടെ ടാസ്ക്.
                </p>
              </div>
            </div>

            {/* Mock Dashboard Layout */}
            <div className="w-full rounded-2xl border border-slate-900 overflow-hidden flex bg-[#0c1020] min-h-[500px] shadow-2xl relative">
              
              {/* Sidebar */}
              <div className="w-48 bg-[#11172f] border-r border-slate-950 p-4 space-y-4 shrink-0 font-sans text-xs">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">WP Admin</div>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Dashboard</div>
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Pages</div>
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Posts</div>
                  <button
                    onClick={() => wpStep === 0 && setWpStep(1)}
                    className={`w-full text-left px-3 py-2 rounded font-bold transition-all cursor-pointer ${
                      wpStep === 0 
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 animate-pulse" 
                        : wpStep >= 1 
                          ? "bg-slate-900 text-white" 
                          : "text-slate-400"
                    }`}
                  >
                    Plugins
                  </button>
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Settings</div>
                </div>
              </div>

              {/* Mock Screen Content */}
              <div className="flex-1 p-6 space-y-6 bg-[#0c1020]">
                {wpStep === 0 && (
                  <div className="space-y-4 text-center py-20">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Welcome to WordPress Dashboard</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">ഇത് നിങ്ങളുടെ വേർഡ്പ്രെസ്സ് അഡ്മിൻ ഹോം പേജാണ്. ഇടതുവശത്തുള്ള പാനലിൽ നിന്ന് പ്ലഗിൻ സെറ്റ് ചെയ്യാൻ <b>Plugins</b> ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.</p>
                  </div>
                )}

                {wpStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <h3 className="text-sm font-bold text-white">Plugins Directory</h3>
                      <button
                        onClick={() => setWpStep(2)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold animate-pulse"
                      >
                        Add New Plugin +
                      </button>
                    </div>
                    <div className="p-8 text-center text-xs text-slate-500 uppercase tracking-widest border border-dashed border-slate-900 rounded-xl">
                      No active plugins found. Click &quot;Add New Plugin&quot; above to search.
                    </div>
                  </div>
                )}

                {wpStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <h3 className="text-sm font-bold text-white">Add Plugins</h3>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Featured Plugins</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Elementor Plugin Card */}
                      <div className="p-4 bg-[#11172f] border border-slate-900 rounded-xl space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-white uppercase">Elementor Page Builder</h4>
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1 rounded uppercase font-bold">Active</span>
                        </div>
                        <p className="text-[10px] text-slate-400">The most popular drag-and-drop page builder for WordPress sites.</p>
                        <button
                          onClick={() => { setWpStep(3); setShowWpSuccess(true); triggerXpAward(); }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold animate-pulse"
                        >
                          Install Now &amp; Activate
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {wpStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <h3 className="text-sm font-bold text-white">Plugins</h3>
                      <button onClick={resetWP} className="text-[10px] text-blue-400 hover:underline">Reset Task</button>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Elementor Builder has been installed and activated successfully!</span>
                    </div>
                    <div className="p-4 bg-[#11172f] border border-slate-900 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">Elementor Builder</p>
                        <p className="text-[10px] text-slate-500">Version 3.20.0 | By Elementor.com</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Success Overlay Modal */}
              <AnimatePresence>
                {showWpSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="glassmorphism p-8 rounded-3xl border border-slate-900 max-w-sm text-center space-y-5"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Task Complete!</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">വേർഡ്പ്രെസ്സിൽ പ്ലഗിനുകൾ എങ്ങനെ ഇൻസ്റ്റാൾ ചെയ്യണമെന്നും ആക്റ്റിവേറ്റ് ചെയ്യണമെന്നും നിങ്ങൾ ഇപ്പോൾ പഠിച്ചു കഴിഞ്ഞു!</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={resetWP}
                          className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                        >
                          Retry Practice
                        </button>
                        <button
                          onClick={() => setActiveSimulator("hub")}
                          className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider"
                        >
                          Simulators Hub
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </section>
        )}

        {/* Shopify Simulator layout */}
        {activeSimulator === "shopify" && (
          <section className="space-y-6">
            
            {/* Guide Instructions panel */}
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-2xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">CURRENT ASSIGNMENT: Add a Shopify Product</p>
                <p className="text-slate-300 font-sans mt-0.5">
                  നിങ്ങളുടെ പുതിയ ഇ-കൊമേഴ്‌സ് വെബ്‌സൈറ്റിലേക്ക് ഒരു ഉല്പന്നം (Product) വിജയകരമായി ആഡ് ചെയ്യുക എന്നതാണ് ഈ ടാസ്ക്.
                </p>
              </div>
            </div>

            {/* Mock Shopify Dashboard Layout */}
            <div className="w-full rounded-2xl border border-slate-900 overflow-hidden flex bg-[#090b11] min-h-[500px] shadow-2xl relative font-sans">
              
              {/* Sidebar */}
              <div className="w-48 bg-[#111319] border-r border-slate-950 p-4 space-y-4 shrink-0 text-xs">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Shopify Partner</div>
                <div className="space-y-1">
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Home</div>
                  <button
                    onClick={() => shopifyStep === 0 && setShopifyStep(1)}
                    className={`w-full text-left px-3 py-2 rounded font-bold transition-all cursor-pointer ${
                      shopifyStep === 0 
                        ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 animate-pulse" 
                        : shopifyStep >= 1 
                          ? "bg-slate-900 text-white font-black" 
                          : "text-slate-400"
                    }`}
                  >
                    Products
                  </button>
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Customers</div>
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Discounts</div>
                  <div className="px-3 py-2 text-slate-400 hover:text-white rounded cursor-not-allowed">Settings</div>
                </div>
              </div>

              {/* Mock Screen Content */}
              <div className="flex-1 p-6 space-y-6 bg-[#090b11] text-xs">
                {shopifyStep === 0 && (
                  <div className="space-y-4 text-center py-20">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">Welcome to Shopify Admin</h3>
                    <p className="text-xs text-slate-450 max-w-sm mx-auto">ഉല്പന്നങ്ങൾ നിയന്ത്രിക്കുന്നതിനായി ഇടതുവശത്തുള്ള മെനുവിൽ നിന്ന് <b>Products</b> എന്ന ബോക്സ് ക്ലിക്ക് ചെയ്യുക.</p>
                  </div>
                )}

                {shopifyStep === 1 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <h3 className="text-sm font-bold text-white">Products Catalog</h3>
                      <button
                        onClick={() => setShopifyStep(2)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold animate-pulse"
                      >
                        Add Product +
                      </button>
                    </div>
                    <div className="p-8 text-center text-slate-500 border border-dashed border-slate-900 rounded-xl">
                      No products found. Start by clicking &quot;Add Product&quot; above.
                    </div>
                  </div>
                )}

                {shopifyStep === 2 && (
                  <form 
                    onSubmit={(e) => { e.preventDefault(); if (productName && productPrice) { setShopifyStep(3); setShowShopifySuccess(true); triggerXpAward(); } }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <h3 className="text-sm font-bold text-white">Add Product Information</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
                        <input
                          type="text"
                          required
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g., Premium Leather Jacket"
                          className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl outline-none text-white text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (INR)</label>
                        <input
                          type="number"
                          required
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          placeholder="e.g., 2999"
                          className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-emerald-500 rounded-xl outline-none text-white text-xs"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!productName || !productPrice}
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Save Product details
                    </button>
                  </form>
                )}

                {shopifyStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                      <h3 className="text-sm font-bold text-white">Products</h3>
                      <button onClick={resetShopify} className="text-[10px] text-emerald-400 hover:underline">Reset Task</button>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Product added successfully! Storefront synchronized.</span>
                    </div>

                    <div className="p-4 bg-[#111319] border border-slate-900 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white">{productName}</p>
                        <p className="text-[10px] text-slate-500">Status: Active</p>
                      </div>
                      <span className="text-xs font-bold text-[#ffff3f]">₹{productPrice}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Success Overlay Modal */}
              <AnimatePresence>
                {showShopifySuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-40 flex items-center justify-center p-6"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="glassmorphism p-8 rounded-3xl border border-slate-900 max-w-sm text-center space-y-5"
                    >
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Product Shipped!</h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">ഹോം പേജിൽ പ്രൊഡക്റ്റുകൾ ആഡ് ചെയ്യാനും ഓൺലൈൻ സ്റ്റോറിൽ വില സെറ്റ് ചെയ്യാനും നിങ്ങൾ പഠിച്ചു കഴിഞ്ഞു!</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={resetShopify}
                          className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                        >
                          Retry Practice
                        </button>
                        <button
                          onClick={() => setActiveSimulator("hub")}
                          className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider"
                        >
                          Simulators Hub
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </section>
        )}

      </div>
    </div>
  );
}

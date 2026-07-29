import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchVehicles } from '../services/vehicleService';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { Sparkles, ShieldCheck, Zap, ArrowRight, Car, CheckCircle2, TrendingUp, Cpu, Award } from 'lucide-react';

export const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetchVehicles({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' });
        setFeaturedVehicles(res.data.vehicles);
      } catch (err) {
        console.error('Failed to load featured vehicles', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="space-y-28 pb-20">
      {/* Hero Banner Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Glow Spotlight */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          {/* Animated Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-cyan-300 text-xs font-semibold uppercase tracking-wider border border-cyan-500/30 shadow-lg shadow-cyan-500/10 animate-float">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Next-Gen AI Fleet Management Platform</span>
          </div>

          {/* Animated Gradient Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl mx-auto leading-tight">
            Find Your Dream Vehicle Powered by <span className="text-gradient">AI Intelligence</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Real-time inventory management with atomic ACID purchase security, multi-criteria filtering, and an intelligent recommendation matchmaker.
          </p>

          {/* Call-to-action Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <Link
              to="/inventory"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold btn-primary text-white shadow-xl flex items-center justify-center gap-3 transition-all"
            >
              Browse Full Inventory <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/ai-assistant"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold glass-panel text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:text-white flex items-center justify-center gap-3 transition-all"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" /> Launch AI Matchmaker
            </Link>
          </div>

          {/* SaaS Stat Counters */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
              <span className="text-3xl font-extrabold text-white">100%</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">ACID Transaction Safety</p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
              <span className="text-3xl font-extrabold text-cyan-400">&lt;200ms</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Search Latency</p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
              <span className="text-3xl font-extrabold text-indigo-400">Dual-Engine</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">AI Recommendation</p>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-slate-800/80">
              <span className="text-3xl font-extrabold text-emerald-400">24 / 7</span>
              <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Inventory Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4" /> Handpicked Fleet
            </span>
            <h2 className="text-3xl font-extrabold text-white">Featured Arrivals</h2>
          </div>
          <Link to="/inventory" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-4 md:mt-0 group">
            View All Vehicles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-dark-800/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">Enterprise Architecture</span>
          <h2 className="text-3xl font-extrabold text-white">Engineered for Reliability & Speed</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Atomic Transactions</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              MongoDB session ACID transactions ensure zero overselling and immediate stock decrementing upon customer purchase.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dual-Engine AI Matching</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Combines generative LLM intelligence with a multi-attribute mathematical rule engine fallback for robust vehicle scoring.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Enterprise RBAC Security</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Role-Based Access Control securing admin inventory management, restock controls, and customer transactions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

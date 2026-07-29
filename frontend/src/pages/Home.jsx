import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchVehicles } from '../services/vehicleService';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { formatCurrency } from '../utils/formatters';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Car,
  CheckCircle2,
  TrendingUp,
  Cpu,
  CalendarCheck,
  Award,
  ChevronRight,
  Flame,
  Gauge,
  Compass,
  Star,
} from 'lucide-react';

export const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetchVehicles({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' });
        setFeaturedVehicles(res.data.vehicles || []);
      } catch (err) {
        console.error('Failed to load featured vehicles', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  // Showcase Vehicles Carousel Data
  const showcaseItems = [
    {
      title: 'BMW X5 xDrive40i M Sport',
      category: 'Luxury Performance SUV',
      price: 9850000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
      acceleration: '4.8s (0-100 km/h)',
      power: '375 HP',
      powertrain: 'TwinPower Turbo Inline-6',
      badge: 'FLAGSHIP SUV',
    },
    {
      title: 'Tesla Model 3 Long Range',
      category: 'Pure Electric Sedan',
      price: 4799000,
      image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&q=80&w=1200',
      acceleration: '4.2s (0-100 km/h)',
      power: '490 HP Dual Motor',
      powertrain: '629 km EV Range',
      badge: 'TOP EV CHOICE',
    },
    {
      title: 'Toyota Fortuner Legender 4x4',
      category: 'Off-Road All-Terrain SUV',
      price: 4520000,
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      acceleration: '9.8s (0-100 km/h)',
      power: '204 HP / 500 Nm',
      powertrain: '2.8L Turbo Diesel 4WD',
      badge: 'BEST SELLER',
    },
    {
      title: 'Mahindra XUV700 AX7 Luxury',
      category: 'Tech-Loaded Family SUV',
      price: 2699000,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',
      acceleration: '8.9s (0-100 km/h)',
      power: '200 HP mStallion',
      powertrain: 'ADAS Level 2 Autonomous',
      badge: 'VALUE CHAMPION',
    },
  ];

  const categoriesGrid = [
    {
      name: 'Luxury SUVs',
      count: '42 Vehicles Available',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=600',
      query: 'SUV',
    },
    {
      name: 'Executive Sedans',
      count: '28 Vehicles Available',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600',
      query: 'Sedan',
    },
    {
      name: 'Electric & Hybrids',
      count: '35 Vehicles Available',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
      query: 'Electric',
    },
    {
      name: 'Sports & Coupes',
      count: '16 Vehicles Available',
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=600',
      query: 'Coupe',
    },
  ];

  const currentShowcase = showcaseItems[activeShowcaseIdx];

  return (
    <div className="space-y-28 pb-20 relative z-10">
      {/* 1. HERO SECTION WITH HERO CAR BANNER & FLOATING BADGES */}
      <section className="relative pt-10 pb-20 overflow-hidden">
        {/* Glow Spotlight Behind Banner */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Pill Badge & Heading */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>India's Premier Luxury & Smart Vehicle Dealership</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
              Drive The Future. <br className="hidden sm:inline" />
              Find Your <span className="text-gradient">Perfect Machine</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              Explore certified pre-owned and brand-new luxury SUVs, electric vehicles, and executive sedans with 100% ACID transaction safety and AI-matched recommendations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/inventory"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold btn-primary text-white shadow-xl flex items-center justify-center gap-3 transition-all"
              >
                Explore All Fleet Inventory <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/ai-assistant"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-extrabold glass-panel text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:text-white flex items-center justify-center gap-3 transition-all"
              >
                <Sparkles className="w-5 h-5 text-cyan-400" /> Launch AI Matchmaker
              </Link>
            </div>
          </div>

          {/* 2. DYNAMIC HERO CAR SHOWCASE DISPLAY */}
          <div className="relative glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Details */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 inline-block mb-3">
                    {currentShowcase.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {currentShowcase.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{currentShowcase.category}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Showroom Price</span>
                    <span className="text-2xl sm:text-3xl font-black text-cyan-400">
                      {formatCurrency(currentShowcase.price)}
                    </span>
                  </div>
                  <Link
                    to="/inventory"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Performance Callouts */}
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <span className="text-slate-400 block text-[10px]">Acceleration</span>
                    <span className="font-bold text-white">{currentShowcase.acceleration}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <Gauge className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <span className="text-slate-400 block text-[10px]">Output</span>
                    <span className="font-bold text-white">{currentShowcase.power}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <Compass className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <span className="text-slate-400 block text-[10px]">Powertrain</span>
                    <span className="font-bold text-white truncate max-w-full block">
                      {currentShowcase.powertrain}
                    </span>
                  </div>
                </div>

                {/* Showcase Selector Tabs */}
                <div className="flex gap-2 pt-2">
                  {showcaseItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveShowcaseIdx(idx)}
                      className={`h-2 rounded-full flex-1 transition-all ${
                        activeShowcaseIdx === idx
                          ? 'bg-cyan-400 shadow-md shadow-cyan-400/50'
                          : 'bg-slate-800 hover:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Image Feature */}
              <div className="lg:col-span-7 relative group">
                <div className="h-[320px] sm:h-[420px] rounded-2xl overflow-hidden relative bg-slate-900 border border-slate-800">
                  <img
                    src={currentShowcase.image}
                    alt={currentShowcase.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 backdrop-blur-md bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>200-Point Quality Inspection Certified</span>
                    </div>
                    <Link to="/inventory" className="text-cyan-400 font-bold hover:underline">
                      Book Test Drive →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BROWSE FLEET BY CATEGORY / BODY STYLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <Car className="w-4 h-4" /> Body Style Selection
            </span>
            <h2 className="text-3xl font-extrabold text-white">Browse Fleet By Category</h2>
          </div>
          <Link to="/inventory" className="text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesGrid.map((cat, idx) => (
            <Link
              key={idx}
              to={`/inventory?category=${cat.query}`}
              className="glass-card rounded-2xl overflow-hidden group border border-slate-800 relative h-64 flex flex-col justify-between p-6 transition-all"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="relative z-10 flex justify-end">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-cyan-500/20">
                  {cat.count}
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
                  Explore Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. RECENT ARRIVALS INVENTORY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4" /> Fresh Additions
            </span>
            <h2 className="text-3xl font-extrabold text-white">Latest Inventory Arrivals</h2>
          </div>
          <Link to="/inventory" className="text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1">
            See Full Inventory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVehicles.slice(0, 3).map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* 5. AI TELEMETRY HUD & MATCHMAKER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl overflow-hidden border border-cyan-500/30 p-8 sm:p-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase">
                <Cpu className="w-4 h-4" /> Multi-Attribute Recommendation Engine
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Not sure which car fits your family? <br />
                Let <span className="text-gradient">AI find your match</span>.
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Input your budget in ₹ INR, passenger capacity, safety expectations, and preferred powertrain. Our scoring engine cross-references live dealership stock to rank the top 3 matches with pros & cons.
              </p>

              <div className="pt-2">
                <Link
                  to="/ai-assistant"
                  className="px-8 py-4 rounded-2xl font-extrabold btn-primary text-white shadow-xl inline-flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-cyan-200" /> Try AI Matchmaker Now
                </Link>
              </div>
            </div>

            {/* AI HUD Telemetry Visual */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl group">
              <img
                src="/images/ai_car_tech.jpg"
                alt="AI Diagnostics Telemetry"
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

              {/* Floating Hologram HUD Badge */}
              <div className="absolute top-4 left-4 backdrop-blur-md bg-slate-950/80 p-3 rounded-xl border border-cyan-500/40 text-xs text-cyan-300 flex items-center gap-2 animate-float">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>AI Telemetry: Structural Integrity 100%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY BUY WITH US / CERTIFIED ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest">DrivePulse Standards</span>
          <h2 className="text-3xl font-extrabold text-white">Why Buy Your Next Car With DrivePulse?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">200-Point Inspection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every vehicle undergoes rigorous mechanical, body, and electronics safety certification.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Doorstep Test Drive</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pick your preferred date and time slot. We deliver the test vehicle directly to your location.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">ACID Atomic Purchase</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              MongoDB session transaction locks prevent over-selling and guarantee instant stock allocation.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Paperless Transfer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hassle-free ownership transfer, instant insurance issuance, and digital RC registration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

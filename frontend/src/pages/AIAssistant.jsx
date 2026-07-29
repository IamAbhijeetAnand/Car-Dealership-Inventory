import React, { useState, useContext } from 'react';
import { fetchAIRecommendations } from '../services/aiService';
import { formatCurrency, formatMileage } from '../utils/formatters';
import { ToastContext } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Sparkles, ThumbsUp, AlertCircle, CheckCircle2, DollarSign, Users, Fuel, Shield, Car, ArrowRight } from 'lucide-react';

export const AIAssistant = () => {
  const { addToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    budget: 4500000, // ₹45,00,000 (45 Lakhs default)
    familySize: 4,
    fuelPreference: 'Any',
    transmission: 'Any',
    vehicleType: 'Any',
    mileagePriority: 'Medium',
    safetyPriority: 'High',
  });

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchAIRecommendations(formData);
      setRecommendations(res.data);
      addToast('AI Matchmaker analyzed dealership fleet successfully!', 'success');
    } catch (err) {
      addToast('Failed to generate AI recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative z-10">
      {/* Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" /> Intelligent Matchmaker Algorithm
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Vehicle Recommendation Assistant</h1>
        <p className="text-sm text-slate-400">
          Input your family budget, driving habits, and safety preferences. Our multi-attribute scoring model cross-references available inventory in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Preference Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-cyan-400" /> Customer Preference Profile
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* Budget Slider in INR */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="font-semibold text-slate-300">Max Budget Target</label>
                <span className="font-extrabold text-cyan-400">{formatCurrency(formData.budget)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="15000000"
                step="250000"
                value={formData.budget}
                onChange={(e) => handleChange('budget', Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Family Size */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Family Capacity (Passengers)</label>
              <select
                value={formData.familySize}
                onChange={(e) => handleChange('familySize', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
              >
                <option value={2}>1 - 2 Passengers (Coupe / Compact)</option>
                <option value={4}>3 - 4 Passengers (Sedan / Crossover)</option>
                <option value={6}>5+ Passengers (Large SUV / Van)</option>
              </select>
            </div>

            {/* Powertrain */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Powertrain Preference</label>
              <select
                value={formData.fuelPreference}
                onChange={(e) => handleChange('fuelPreference', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
              >
                <option value="Any">Any Powertrain</option>
                <option value="Electric">Pure Electric (EV)</option>
                <option value="Hybrid">Hybrid / Plug-in Hybrid</option>
                <option value="Gasoline">Gasoline Internal Combustion</option>
              </select>
            </div>

            {/* Safety Priority */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Safety Rating Priority</label>
              <select
                value={formData.safetyPriority}
                onChange={(e) => handleChange('safetyPriority', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
              >
                <option value="High">High (5-Star NHTSA Crash Test Focus)</option>
                <option value="Standard">Standard Rating</option>
              </select>
            </div>

            {/* Mileage Priority */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Fuel Economy / Low Mileage Focus</label>
              <select
                value={formData.mileagePriority}
                onChange={(e) => handleChange('mileagePriority', e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
              >
                <option value="High">High (Maximum MPGe / Low Odometer)</option>
                <option value="Medium">Medium</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:opacity-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              {loading ? 'Evaluating Scoring Models...' : 'Generate Top Recommendations'}
            </button>
          </form>
        </div>

        {/* AI Output Section */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <LoadingSpinner label="Running Multi-Attribute Utility Scoring across active inventory..." />
          ) : !recommendations ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
              <Sparkles className="w-12 h-12 text-cyan-400/40 mx-auto" />
              <h3 className="text-xl font-bold text-white">Your AI Recommendations will appear here</h3>
              <p className="text-sm text-slate-400">
                Adjust your budget and preferences on the left, then click Generate.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Top 3 Tailored Vehicle Matches</h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                  Engine: {recommendations.mode}
                </span>
              </div>

              {recommendations.recommendations?.map((item, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest">
                        Match Rank #{idx + 1}
                      </span>
                      <h4 className="text-2xl font-black text-white mt-0.5">
                        {item.vehicle?.year} {item.vehicle?.make} {item.vehicle?.model}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-2xl font-black text-cyan-400">{formatCurrency(item.vehicle?.price)}</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-lg">
                        {item.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{item.rationale}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Pros */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> Recommendation Pros
                      </h5>
                      <ul className="space-y-1 text-slate-300">
                        {item.pros?.map((p, i) => (
                          <li key={i}>• {p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-amber-400 flex items-center gap-1 uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" /> Potential Trade-offs
                      </h5>
                      <ul className="space-y-1 text-slate-400">
                        {item.cons?.map((c, i) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

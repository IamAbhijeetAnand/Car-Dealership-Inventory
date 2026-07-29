import React from 'react';
import { CATEGORIES, FUEL_TYPES, TRANSMISSIONS, SORT_OPTIONS } from '../../utils/constants';
import { Search, Filter, RotateCcw } from 'lucide-react';

export const VehicleFilterBar = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 mb-8">
      {/* Search Input Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by make, model, or VIN (e.g. Honda, Tesla, RAV4)..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Sort Selector */}
        <div className="w-full md:w-64">
          <select
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFilterChange('sortBy', sortBy);
              onFilterChange('sortOrder', sortOrder);
            }}
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            {SORT_OPTIONS.map((opt, idx) => (
              <option key={idx} value={`${opt.value}-${opt.order}`}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Multi-Criteria Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:border-cyan-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Fuel Powertrain
          </label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => onFilterChange('fuelType', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:border-cyan-500"
          >
            <option value="">All Fuel Types</option>
            {FUEL_TYPES.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Transmission
          </label>
          <select
            value={filters.transmission || ''}
            onChange={(e) => onFilterChange('transmission', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:border-cyan-500"
          >
            <option value="">All Transmissions</option>
            {TRANSMISSIONS.map((trans) => (
              <option key={trans} value={trans}>
                {trans}
              </option>
            ))}
          </select>
        </div>

        {/* Max Price Range */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Max Budget ($)
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-slate-200 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Reset Filters */}
      <div className="flex justify-end pt-2 border-t border-slate-800/80">
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

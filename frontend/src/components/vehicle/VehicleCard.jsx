import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatMileage } from '../../utils/formatters';
import { Fuel, Gauge, Zap, Star, ShoppingBag, Eye, CalendarCheck } from 'lucide-react';

export const VehicleCard = ({ vehicle, onPurchase, onBookTestDrive, isAdmin, onRestock, onDelete }) => {
  const isAvailable = vehicle.stockQuantity > 0;
  const isLowStock = vehicle.stockQuantity > 0 && vehicle.stockQuantity <= 2;

  return (
    <div className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col h-full">
      {/* Vehicle Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        <img
          src={vehicle.imageUrls[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-cyan-500/20">
            {vehicle.category}
          </span>
          {isLowStock && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 backdrop-blur-md text-amber-400 border border-amber-500/30">
              Only {vehicle.stockQuantity} Left
            </span>
          )}
          {!isAvailable && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 backdrop-blur-md text-rose-400 border border-rose-500/30">
              Sold Out
            </span>
          )}
        </div>

        {/* Price Tag in INR */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-xl text-base font-extrabold bg-cyan-500 text-slate-950 shadow-lg">
            {formatCurrency(vehicle.price)}
          </span>
        </div>
      </div>

      {/* Vehicle Specs Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{vehicle.year} Model</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold text-slate-300">{vehicle.safetyRating} / 5</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {vehicle.make} {vehicle.model}
          </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-xs text-slate-400">
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-800/40">
            <Fuel className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="truncate max-w-full">{vehicle.fuelType}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-800/40">
            <Zap className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="truncate max-w-full">{vehicle.transmission}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-800/40">
            <Gauge className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="truncate max-w-full">{formatMileage(vehicle.mileage)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/vehicle/${vehicle._id}`}
              className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Details
            </Link>

            {onBookTestDrive && (
              <button
                onClick={() => onBookTestDrive(vehicle)}
                className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/90 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <CalendarCheck className="w-4 h-4 text-cyan-400" />
                Test Drive
              </button>
            )}
          </div>

          {isAvailable && onPurchase && (
            <button
              onClick={() => onPurchase(vehicle)}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:opacity-95 flex items-center justify-center gap-1.5 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy Now
            </button>
          )}

          {isAdmin && (
            <div className="flex gap-1 pt-1">
              <button
                onClick={() => onRestock(vehicle)}
                className="flex-1 p-2 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                title="Restock Inventory"
              >
                +Restock
              </button>
              <button
                onClick={() => onDelete(vehicle._id)}
                className="px-3 p-2 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                title="Delete Vehicle"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

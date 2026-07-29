import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVehicleById, purchaseVehicle } from '../services/vehicleService';
import { formatCurrency, formatMileage } from '../utils/formatters';
import { ToastContext } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Fuel, Gauge, Zap, Star, ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToast } = useContext(ToastContext);

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const res = await fetchVehicleById(id);
        setVehicle(res.data);
      } catch (err) {
        addToast('Failed to load vehicle details', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadVehicle();
  }, [id]);

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      addToast('Please sign in to complete purchase', 'error');
      navigate('/login');
      return;
    }

    setPurchasing(true);
    try {
      await purchaseVehicle({ vehicleId: vehicle._id, quantity: 1 });
      addToast(`Purchase Successful! You bought 1 ${vehicle.make} ${vehicle.model}.`, 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Purchase transaction failed', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <LoadingSpinner label="Fetching vehicle spec sheet..." />;
  if (!vehicle) return <div className="text-center py-20 text-white">Vehicle not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Main Image */}
        <div className="space-y-4">
          <div className="h-[400px] rounded-3xl overflow-hidden bg-slate-800 border border-slate-800 shadow-2xl">
            <img
              src={vehicle.imageUrls[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Vehicle Spec Sheet */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">
              <span>{vehicle.category}</span> • <span>{vehicle.year} Model</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-xs text-slate-400 mt-1">VIN: {vehicle.vin}</p>
          </div>

          {/* Pricing Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">MSRP List Price</span>
              <span className="text-3xl font-black text-cyan-400">{formatCurrency(vehicle.price)}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Stock Availability</span>
              <span className={`text-sm font-bold ${vehicle.stockQuantity > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {vehicle.stockQuantity > 0 ? `${vehicle.stockQuantity} Units In Stock` : 'Sold Out'}
              </span>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <Fuel className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-slate-400 block">Fuel Type</span>
              <span className="text-sm font-bold text-white">{vehicle.fuelType}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-slate-400 block">Transmission</span>
              <span className="text-sm font-bold text-white">{vehicle.transmission}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <Gauge className="w-5 h-5 text-cyan-400" />
              <span className="text-xs text-slate-400 block">Odometer</span>
              <span className="text-sm font-bold text-white">{formatMileage(vehicle.mileage)}</span>
            </div>
          </div>

          {/* Key Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Features & Options</h4>
              <div className="grid grid-cols-2 gap-2">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Action Button */}
          <div className="pt-4">
            <button
              onClick={handlePurchase}
              disabled={vehicle.stockQuantity === 0 || purchasing}
              className="w-full py-4 rounded-2xl text-base font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/25 disabled:opacity-50 hover:opacity-95 flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {purchasing
                ? 'Executing Atomic Transaction...'
                : vehicle.stockQuantity > 0
                ? 'Purchase Vehicle Now'
                : 'Vehicle Currently Sold Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

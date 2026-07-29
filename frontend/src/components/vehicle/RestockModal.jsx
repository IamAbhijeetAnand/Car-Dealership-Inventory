import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { restockVehicle } from '../../services/vehicleService';
import { PackagePlus } from 'lucide-react';

export const RestockModal = ({ isOpen, onClose, vehicle, onSuccess, addToast }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!vehicle) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await restockVehicle({ vehicleId: vehicle._id, quantity: Number(quantity) });
      addToast(`Restocked ${quantity} unit(s) for ${vehicle.make} ${vehicle.model}!`, 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to restock vehicle', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restock Inventory Quantity">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
          <p className="text-sm font-semibold text-white">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </p>
          <p className="text-xs text-slate-400 mt-1">VIN: {vehicle.vin}</p>
          <p className="text-xs text-cyan-400 mt-1">Current Stock: {vehicle.stockQuantity} units</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Quantity to Add
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg flex items-center gap-2"
          >
            <PackagePlus className="w-4 h-4" />
            {loading ? 'Restocking...' : 'Confirm Restock'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

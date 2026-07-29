import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { createVehicle } from '../../services/vehicleService';
import { CATEGORIES, FUEL_TYPES, TRANSMISSIONS } from '../../utils/constants';

export const AddVehicleModal = ({ isOpen, onClose, onSuccess, addToast }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      stockQuantity: 1,
      safetyRating: 5,
      year: new Date().getFullYear(),
      category: 'Sedan',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        year: Number(data.year),
        price: Number(data.price),
        stockQuantity: Number(data.stockQuantity),
        mileage: Number(data.mileage),
        safetyRating: Number(data.safetyRating),
        imageUrls: data.imageUrl ? [data.imageUrl] : undefined,
        features: data.featuresString ? data.featuresString.split(',').map((f) => f.trim()) : [],
      };
      await createVehicle(payload);
      addToast('Vehicle added to dealership inventory successfully!', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add vehicle', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle to Inventory">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm text-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">VIN (17 Characters)</label>
            <input
              {...register('vin', { required: 'VIN is required', pattern: { value: /^[A-HJ-NPR-Z0-9]{17}$/, message: 'Invalid 17-char VIN' } })}
              placeholder="e.g. 1HGCR2F83HA123456"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
            {errors.vin && <span className="text-xs text-rose-400">{errors.vin.message}</span>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Make</label>
            <input
              {...register('make', { required: 'Make is required' })}
              placeholder="e.g. Mahindra"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Model</label>
            <input
              {...register('model', { required: 'Model is required' })}
              placeholder="e.g. XUV700"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Model Year</label>
            <input
              type="number"
              {...register('year', { required: true })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price (₹ INR)</label>
            <input
              type="number"
              {...register('price', { required: 'Price is required' })}
              placeholder="2699000"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Initial Stock Quantity</label>
            <input
              type="number"
              {...register('stockQuantity', { required: true, min: 0 })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select {...register('category')} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Fuel Powertrain</label>
            <select {...register('fuelType')} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Transmission</label>
            <select {...register('transmission')} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white">
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Mileage (Odometer in KM)</label>
            <input
              type="number"
              {...register('mileage', { required: true })}
              placeholder="1200"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            {...register('imageUrl')}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Features (Comma Separated)</label>
          <input
            {...register('featuresString')}
            placeholder="Sunroof, ADAS Level 2, Leather Seats, Autopilot"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

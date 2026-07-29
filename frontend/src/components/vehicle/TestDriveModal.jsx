import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { bookTestDrive } from '../../services/vehicleService';
import { Calendar, Clock, Phone, FileText, CalendarCheck } from 'lucide-react';

export const TestDriveModal = ({ isOpen, onClose, vehicle, onSuccess, addToast }) => {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!vehicle) return null;

  // Calculate minimum selectable date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preferredDate) {
      addToast('Please select your preferred date for the test drive.', 'error');
      return;
    }

    setLoading(true);
    try {
      await bookTestDrive({
        vehicleId: vehicle._id,
        preferredDate,
        preferredTimeSlot,
        contactPhone,
        notes,
      });
      addToast(`Test drive booked successfully for ${vehicle.make} ${vehicle.model}!`, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to book test drive', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book a Test Drive">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm text-slate-300">
        {/* Vehicle Preview Card */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-4">
          <img
            src={vehicle.imageUrls?.[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}
            alt={vehicle.model}
            className="w-16 h-12 object-cover rounded-lg"
          />
          <div>
            <p className="text-base font-bold text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-xs text-cyan-400 font-semibold">{vehicle.category} • {vehicle.fuelType}</p>
          </div>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block mb-1 font-semibold text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-400" /> Preferred Date
          </label>
          <input
            type="date"
            min={minDateString}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500"
            required
          />
        </div>

        {/* Time Slot */}
        <div>
          <label className="block mb-1 font-semibold text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> Preferred Time Slot
          </label>
          <select
            value={preferredTimeSlot}
            onChange={(e) => setPreferredTimeSlot(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500"
          >
            <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
            <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
            <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
            <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
          </select>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-semibold text-slate-200 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-cyan-400" /> Contact Phone Number
          </label>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-semibold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" /> Additional Notes (Optional)
          </label>
          <textarea
            rows="2"
            placeholder="e.g. Interested in checking highway acceleration & rear seat legroom"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:border-cyan-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg flex items-center gap-2"
          >
            <CalendarCheck className="w-4 h-4" />
            {loading ? 'Submitting Schedule...' : 'Confirm Test Drive'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState, useEffect, useContext } from 'react';
import { fetchMyPurchases, fetchMyTestDrives } from '../services/vehicleService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ShoppingBag, CalendarCheck, Clock, Phone, Car, CheckCircle2, Clock3 } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useContext(ToastContext);

  const [activeTab, setActiveTab] = useState('purchases'); // 'purchases' | 'testDrives'
  const [purchases, setPurchases] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [pRes, tdRes] = await Promise.all([
          fetchMyPurchases(),
          fetchMyTestDrives(),
        ]);
        setPurchases(pRes.data || []);
        setTestDrives(tdRes.data || []);
      } catch (err) {
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
      {/* Account Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/20">
            {user?.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize">
              Customer Account
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass-card px-5 py-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-xl font-black text-white">{purchases.length}</span>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Purchases</p>
          </div>
          <div className="glass-card px-5 py-3 rounded-2xl border border-slate-800 text-center">
            <span className="text-xl font-black text-cyan-400">{testDrives.length}</span>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Test Drives</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'purchases'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> My Purchases ({purchases.length})
        </button>
        <button
          onClick={() => setActiveTab('testDrives')}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'testDrives'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CalendarCheck className="w-4 h-4" /> Booked Test Drives ({testDrives.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingSpinner label="Fetching customer records..." />
      ) : activeTab === 'purchases' ? (
        /* Purchases Ledger */
        purchases.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <Car className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-white">No vehicle purchases yet</h4>
            <p className="text-sm text-slate-400">Explore our inventory to purchase your preferred car!</p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Purchased Date</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {purchases.map((txn) => (
                    <tr key={txn._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-cyan-400 font-bold">{txn.transactionId}</td>
                      <td className="px-6 py-4 font-semibold text-white">
                        {txn.vehicle ? `${txn.vehicle.year} ${txn.vehicle.make} ${txn.vehicle.model}` : 'Vehicle Archived'}
                      </td>
                      <td className="px-6 py-4">{formatDate(txn.purchasedAt)}</td>
                      <td className="px-6 py-4">{txn.quantity}</td>
                      <td className="px-6 py-4 font-bold text-cyan-400">{formatCurrency(txn.totalPrice)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {txn.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Test Drives Ledger */
        testDrives.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-white">No test drive bookings yet</h4>
            <p className="text-sm text-slate-400">Browse inventory and book a test drive for your preferred date!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testDrives.map((td) => (
              <div key={td._id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs text-cyan-400 font-bold block">{td.bookingId}</span>
                    <h4 className="text-lg font-bold text-white mt-0.5">
                      {td.vehicle ? `${td.vehicle.year} ${td.vehicle.make} ${td.vehicle.model}` : 'Vehicle'}
                    </h4>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      td.status === 'Confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : td.status === 'Completed'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                        : td.status === 'Cancelled'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {td.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60">
                    <CalendarCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Scheduled Date</span>
                      <span className="font-semibold">{formatDate(td.preferredDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60">
                    <Clock3 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Time Slot</span>
                      <span className="font-semibold">{td.preferredTimeSlot}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact: {td.contactPhone}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

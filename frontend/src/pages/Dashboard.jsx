import React, { useState, useEffect, useContext } from 'react';
import { fetchMyPurchases } from '../services/vehicleService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ShoppingBag, User, Calendar, ShieldCheck, Car } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useContext(ToastContext);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetchMyPurchases();
        setPurchases(res.data);
      } catch (err) {
        addToast('Failed to load purchase history', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black">
            {user?.name?.[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 capitalize">
              {user?.role} Account
            </span>
          </div>
        </div>
      </div>

      {/* Purchase History Ledger */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-cyan-400" /> My Order & Purchase History
        </h2>

        {loading ? (
          <LoadingSpinner label="Fetching your order ledger..." />
        ) : purchases.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <Car className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-white">No vehicle purchases yet</h4>
            <p className="text-sm text-slate-400">Explore our inventory to make your first vehicle purchase!</p>
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
        )}
      </div>
    </div>
  );
};

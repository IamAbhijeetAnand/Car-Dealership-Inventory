import React, { useState, useEffect, useContext } from 'react';
import { fetchAdminDashboardMetrics, fetchVehicles, deleteVehicle, fetchAllTransactions } from '../services/vehicleService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ToastContext } from '../context/ToastContext';
import { RestockModal } from '../components/vehicle/RestockModal';
import { AddVehicleModal } from '../components/vehicle/AddVehicleModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ShieldAlert, Plus, PackagePlus, Trash2, DollarSign, Car, ShoppingBag, Users, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  const { addToast } = useContext(ToastContext);

  const [metrics, setMetrics] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'transactions'

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [restockItem, setRestockItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, vRes, tRes] = await Promise.all([
        fetchAdminDashboardMetrics(),
        fetchVehicles({ limit: 50 }),
        fetchAllTransactions(),
      ]);
      setMetrics(mRes.data);
      setVehicles(vRes.data.vehicles);
      setTransactions(tRes.data);
    } catch (err) {
      addToast('Failed to load admin metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from inventory?')) return;
    try {
      await deleteVehicle(id);
      addToast('Vehicle removed from inventory', 'success');
      loadData();
    } catch (err) {
      addToast('Failed to delete vehicle', 'error');
    }
  };

  if (loading) return <LoadingSpinner label="Loading Executive Admin Console..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <ShieldAlert className="w-4 h-4" /> Dealership Control Center
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Admin Operations Portal</h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg flex items-center gap-2 self-start"
        >
          <Plus className="w-5 h-5" /> Add New Vehicle
        </button>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{formatCurrency(metrics.totalRevenue)}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Fleet Valuation</span>
              <Car className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{formatCurrency(metrics.totalInventoryValuation)}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Units Sold</span>
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white mt-2">{metrics.totalSalesCount} Cars</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Low Stock Alerts</span>
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400 mt-2">{metrics.lowStockAlerts?.length || 0} Models</p>
          </div>
        </div>
      )}

      {/* Tab Selectors */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'inventory'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Vehicle Inventory ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'transactions'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          All Dealership Transactions ({transactions.length})
        </button>
      </div>

      {/* Inventory Management Table */}
      {activeTab === 'inventory' ? (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">VIN</th>
                  <th className="px-6 py-4">Vehicle Model</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{v.vin}</td>
                    <td className="px-6 py-4 font-bold text-white">
                      {v.year} {v.make} {v.model}
                    </td>
                    <td className="px-6 py-4 font-bold text-cyan-400">{formatCurrency(v.price)}</td>
                    <td className="px-6 py-4 font-semibold">{v.stockQuantity} units</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          v.stockQuantity === 0
                            ? 'bg-rose-500/10 text-rose-400'
                            : v.stockQuantity <= 2
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setRestockItem(v)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 flex items-center gap-1"
                        >
                          <PackagePlus className="w-3.5 h-3.5" /> Restock
                        </button>
                        <button
                          onClick={() => handleDelete(v._id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Transactions Ledger Table */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Txn ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-mono text-xs text-cyan-400 font-bold">{t.transactionId}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{t.user?.name}</p>
                      <p className="text-xs text-slate-400">{t.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      {t.vehicle ? `${t.vehicle.make} ${t.vehicle.model}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-bold text-cyan-400">{formatCurrency(t.totalPrice)}</td>
                    <td className="px-6 py-4">{formatDate(t.purchasedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
        addToast={addToast}
      />

      {/* Restock Modal */}
      {restockItem && (
        <RestockModal
          isOpen={!!restockItem}
          onClose={() => setRestockItem(null)}
          vehicle={restockItem}
          onSuccess={loadData}
          addToast={addToast}
        />
      )}
    </div>
  );
};

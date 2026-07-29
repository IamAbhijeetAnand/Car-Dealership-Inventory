import React, { useState, useEffect, useContext, useCallback } from 'react';
import { fetchVehicles, purchaseVehicle } from '../services/vehicleService';
import { VehicleCard } from '../components/vehicle/VehicleCard';
import { VehicleFilterBar } from '../components/vehicle/VehicleFilterBar';
import { RestockModal } from '../components/vehicle/RestockModal';
import { TestDriveModal } from '../components/vehicle/TestDriveModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ToastContext } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useDebounce';
import { ChevronLeft, ChevronRight, Car } from 'lucide-react';

export const Inventory = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { addToast } = useContext(ToastContext);

  const [vehicles, setVehicles] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filter State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    fuelType: '',
    transmission: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
  });

  // Debounced search query
  const debouncedSearch = useDebounce(filters.search, 400);

  // Modal states
  const [restockVehicleItem, setRestockVehicleItem] = useState(null);
  const [testDriveVehicleItem, setTestDriveVehicleItem] = useState(null);

  const loadInventory = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        search: debouncedSearch,
      };
      const res = await fetchVehicles(queryParams);
      setVehicles(res.data.vehicles);
      setPagination(res.data.pagination);
    } catch (err) {
      addToast('Failed to fetch vehicle inventory', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.fuelType, filters.transmission, filters.maxPrice, filters.sortBy, filters.sortOrder, filters.page, debouncedSearch]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // Reset page to 1 on filter changes
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      fuelType: '',
      transmission: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
  };

  const handlePurchase = async (vehicle) => {
    if (!isAuthenticated) {
      addToast('Please sign in to purchase vehicles.', 'error');
      return;
    }

    try {
      await purchaseVehicle({ vehicleId: vehicle._id, quantity: 1 });
      addToast(`Congratulations! Purchased 1 unit of ${vehicle.make} ${vehicle.model}.`, 'success');
      loadInventory();
    } catch (err) {
      addToast(err.response?.data?.message || 'Purchase failed', 'error');
    }
  };

  const handleBookTestDrive = (vehicle) => {
    if (!isAuthenticated) {
      addToast('Please sign in to book a test drive.', 'error');
      return;
    }
    setTestDriveVehicleItem(vehicle);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Fleet Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse all vehicles present in our dealership inventory with real-time multi-criteria filtering
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-cyan-400 font-semibold flex items-center gap-2 self-start">
          <Car className="w-4 h-4 text-cyan-400" />
          Showing {vehicles.length} of {pagination.total} Vehicles
        </div>
      </div>

      {/* Filter Bar */}
      <VehicleFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Grid or Loader */}
      {loading ? (
        <LoadingSpinner label="Querying vehicle inventory database..." />
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 space-y-3">
          <Car className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No vehicles match your search criteria</h3>
          <p className="text-sm text-slate-400">Try adjusting your filters or resetting the search parameters.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-cyan-400 hover:bg-slate-700"
          >
            Reset Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard
              key={v._id}
              vehicle={v}
              onPurchase={handlePurchase}
              onBookTestDrive={handleBookTestDrive}
              isAdmin={isAdmin}
              onRestock={(vItem) => setRestockVehicleItem(vItem)}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            disabled={filters.page === 1}
            onClick={() => handleFilterChange('page', filters.page - 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs font-medium text-slate-400">
            Page <strong className="text-white">{pagination.page}</strong> of{' '}
            <strong className="text-white">{pagination.pages}</strong>
          </span>

          <button
            disabled={filters.page >= pagination.pages}
            onClick={() => handleFilterChange('page', filters.page + 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 disabled:opacity-50 hover:bg-slate-700 flex items-center gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Restock Modal */}
      {restockVehicleItem && (
        <RestockModal
          isOpen={!!restockVehicleItem}
          onClose={() => setRestockVehicleItem(null)}
          vehicle={restockVehicleItem}
          onSuccess={loadInventory}
          addToast={addToast}
        />
      )}

      {/* Customer Test Drive Modal */}
      {testDriveVehicleItem && (
        <TestDriveModal
          isOpen={!!testDriveVehicleItem}
          onClose={() => setTestDriveVehicleItem(null)}
          vehicle={testDriveVehicleItem}
          addToast={addToast}
        />
      )}
    </div>
  );
};

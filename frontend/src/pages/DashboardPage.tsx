import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { VehicleGrid } from '../components/VehicleGrid';
import { VehicleFormModal } from '../components/VehicleFormModal';
import type { Vehicle } from '../components/VehicleCard';
import { vehiclesApi } from '../api/vehicles.api';

export const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const fetchVehicles = useCallback(async () => {
    if (!token) { setVehicles([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await vehiclesApi.getAll(token);
      if (res.vehicles) setVehicles(res.vehicles);
      else if (res.error) showNotification(res.error, 'error');
    } catch { showNotification('Failed to load inventory.', 'error'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification((p) => (p?.message === message ? null : p)), 4000);
  };

  const handleSearch = async (params: { make?: string; model?: string; category?: string; minPrice?: string; maxPrice?: string }) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await vehiclesApi.search(params, token);
      if (res.vehicles) { setVehicles(res.vehicles); setActiveCategory(params.category || 'All'); }
      else if (res.error) showNotification(res.error, 'error');
    } catch { showNotification('Search failed.', 'error'); }
    finally { setLoading(false); }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') fetchVehicles();
    else handleSearch({ category: cat });
  };

  const totalStock = vehicles.reduce((s, v) => s + v.quantity, 0);
  const categories = ['All', 'Coupe', 'Sedan', 'SUV', 'Truck', 'Hatchback', 'Convertible', 'Wagon', 'Supercar'];

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 space-y-6">
      {/* Toast */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-lg border animate-slide-in-right flex items-center gap-2.5 ${
          notification.type === 'success'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <span className="text-sm font-bold">{notification.type === 'success' ? '✓' : '✕'}</span>
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Hero */}
      <div className="animate-fade-up bg-zinc-900 rounded-xl border border-zinc-800/60 p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-ring" />
              Live Inventory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Performance<br />Showroom
            </h1>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              Browse verified high-performance vehicles. Filter by spec, category, or price. Instant secure transactions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {isAdmin && (
              <button
                onClick={() => { setModalMode('add'); setSelectedVehicle(null); setIsModalOpen(true); }}
                className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-500 text-zinc-950 hover:bg-green-400 transition-colors duration-200 active:scale-95 transform flex items-center gap-1.5"
              >
                <span className="text-base leading-none">+</span> Add Vehicle
              </button>
            )}
            {token && (
              <div className="flex gap-4 text-xs text-zinc-500">
                <span>Models <strong className="text-zinc-200 animate-count-up font-bold">{vehicles.length}</strong></span>
                <span>Stock <strong className="text-green-400 animate-count-up font-bold">{totalStock}</strong></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!token ? (
        <div className="animate-fade-up bg-zinc-900 rounded-xl border border-zinc-800/60 p-10 text-center max-w-md mx-auto my-8">
          <p className="text-3xl mb-3">🔐</p>
          <h3 className="text-base font-bold text-zinc-200 mb-1">Access Required</h3>
          <p className="text-sm text-zinc-500">Log in or register to browse the showroom and make purchases.</p>
        </div>
      ) : (
        <>
          <SearchFilterBar onSearch={handleSearch} onReset={() => { setActiveCategory('All'); fetchVehicles(); }} />

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 animate-fade-up" style={{ animationDelay: '100ms' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800/60 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <VehicleGrid
            vehicles={vehicles}
            loading={loading}
            onEdit={(v) => { setModalMode('edit'); setSelectedVehicle(v); setIsModalOpen(true); }}
            onRefresh={fetchVehicles}
            onNotify={showNotification}
          />
        </>
      )}

      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedVehicle}
        onSuccess={fetchVehicles}
        onNotify={showNotification}
      />
    </div>
  );
};

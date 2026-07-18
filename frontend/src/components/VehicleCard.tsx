import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { vehiclesApi } from '../api/vehicles.api';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onRefresh?: () => void;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

const getCategoryImage = (category: string, make: string) => {
  const key = `${make.toLowerCase()}-${category.toLowerCase()}`;
  const map: Record<string, string> = {
    'porsche-coupe': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    'bmw-sedan': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    'mercedes-amg-suv': 'https://images.unsplash.com/photo-1606611013016-969c19ba27ea?auto=format&fit=crop&w=800&q=80',
    'ford-truck': 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=800&q=80',
    'audi-sedan': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    'toyota-hatchback': 'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&w=800&q=80',
    'chevrolet-coupe': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    'land rover-suv': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
  };
  if (map[key]) return map[key];
  switch (category.toLowerCase()) {
    case 'suv': return 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80';
    case 'truck': return 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=800&q=80';
    case 'coupe': return 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80';
    case 'hatchback': return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';
    case 'convertible': return 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80';
    case 'wagon': return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80';
    case 'supercar': return 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80';
    default: return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';
  }
};

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onRefresh, onNotify }) => {
  const { user, token } = useAuth();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const isOutOfStock = vehicle.quantity <= 0;
  const isAdmin = user?.role === 'ADMIN';

  const handlePurchase = async () => {
    if (!token) { onNotify?.('Please login first.', 'error'); return; }
    setLoadingAction('purchase');
    try {
      const res = await vehiclesApi.purchase(vehicle.id, token);
      if (res.error) onNotify?.(res.error, 'error');
      else { onNotify?.(`Purchased ${vehicle.make} ${vehicle.model}!`, 'success'); onRefresh?.(); }
    } catch { onNotify?.('Purchase failed.', 'error'); }
    finally { setLoadingAction(null); }
  };

  const handleRestock = async () => {
    setLoadingAction('restock');
    try {
      const res = await vehiclesApi.restock(vehicle.id, 3, token);
      if (res.error) onNotify?.(res.error, 'error');
      else { onNotify?.(`Restocked +3 units.`, 'success'); onRefresh?.(); }
    } catch { onNotify?.('Restock failed.', 'error'); }
    finally { setLoadingAction(null); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) return;
    setLoadingAction('delete');
    try {
      const res = await vehiclesApi.delete(vehicle.id, token);
      if (res.error) onNotify?.(res.error, 'error');
      else { onNotify?.('Deleted.', 'success'); onRefresh?.(); }
    } catch { onNotify?.('Delete failed.', 'error'); }
    finally { setLoadingAction(null); }
  };

  return (
    <div className="animate-fade-up group bg-zinc-900 rounded-xl border border-zinc-800/60 overflow-hidden flex flex-col transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-zinc-950">
        <img
          src={getCategoryImage(vehicle.category, vehicle.make)}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-zinc-950/30 group-hover:bg-zinc-950/10 transition-colors duration-500" />

        {/* Category tag */}
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-zinc-300 bg-zinc-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-zinc-700/40">
          {vehicle.category}
        </span>

        {/* Stock badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md border backdrop-blur-sm ${
          isOutOfStock
            ? 'text-red-400 bg-red-500/10 border-red-500/30'
            : 'text-green-400 bg-green-500/10 border-green-500/30'
        }`}>
          {isOutOfStock ? (
            'Sold Out'
          ) : (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-ring" />
              {vehicle.quantity} in stock
            </span>
          )}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-bold text-zinc-100 group-hover:text-white transition-colors">
              {vehicle.make} <span className="text-zinc-400 font-medium">{vehicle.model}</span>
            </h3>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-white tracking-tight font-[JetBrains_Mono]">
            ${vehicle.price.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
            Factory warranty • Multi-point inspection
          </p>
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            disabled={isOutOfStock || loadingAction !== null}
            onClick={handlePurchase}
            className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.97] ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                : 'bg-green-500 text-zinc-950 hover:bg-green-400 active:bg-green-600'
            }`}
          >
            {loadingAction === 'purchase' ? 'Processing...' : isOutOfStock ? 'Unavailable' : 'Purchase'}
          </button>

          {isAdmin && (
            <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => onEdit?.(vehicle)} disabled={loadingAction !== null}
                className="py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200 border border-zinc-700/50 transition-all duration-200"
              >Edit</button>
              <button onClick={handleRestock} disabled={loadingAction !== null}
                className="py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all duration-200"
              >{loadingAction === 'restock' ? '...' : '+3'}</button>
              <button onClick={handleDelete} disabled={loadingAction !== null}
                className="py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all duration-200"
              >{loadingAction === 'delete' ? '...' : 'Del'}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

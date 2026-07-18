import React from 'react';
import { VehicleCard, type Vehicle } from './VehicleCard';

interface VehicleGridProps {
  vehicles?: Vehicle[];
  loading?: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onRefresh?: () => void;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

export const VehicleGrid: React.FC<VehicleGridProps> = ({
  vehicles = [],
  loading = false,
  onEdit,
  onRefresh,
  onNotify,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800/60 overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="h-48 skeleton" />
            <div className="p-5 space-y-3">
              <div className="h-4 skeleton rounded w-3/4" />
              <div className="h-7 skeleton rounded w-1/3" />
              <div className="h-3 skeleton rounded w-1/2" />
              <div className="h-10 skeleton rounded-lg mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="animate-fade-up text-center py-16 bg-zinc-900 rounded-xl border border-zinc-800/60 max-w-lg mx-auto my-6">
        <p className="text-4xl mb-3">🏎️</p>
        <h3 className="text-base font-bold text-zinc-200">No vehicles found</h3>
        <p className="text-sm text-zinc-500 mt-1 max-w-xs mx-auto">
          Try adjusting your filters or resetting the search.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} onEdit={onEdit} onRefresh={onRefresh} onNotify={onNotify} />
      ))}
    </div>
  );
};

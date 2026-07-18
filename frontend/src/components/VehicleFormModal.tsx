import React, { useState, useEffect } from 'react';
import type { Vehicle } from './VehicleCard';
import { vehiclesApi } from '../api/vehicles.api';
import { useAuth } from '../context/AuthContext';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Vehicle | null;
  onSuccess?: () => void;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen, onClose, mode, initialData, onSuccess, onNotify,
}) => {
  const { token } = useAuth();
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (initialData && mode === 'edit') {
      setMake(initialData.make); setModel(initialData.model); setCategory(initialData.category);
      setPrice(initialData.price.toString()); setQuantity(initialData.quantity.toString());
    } else {
      setMake(''); setModel(''); setCategory('Sedan'); setPrice(''); setQuantity('');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null); setLoading(true);
    try {
      const p = Number(price), q = Number(quantity);
      if (isNaN(p) || isNaN(q)) { setError('Enter valid numbers.'); setLoading(false); return; }
      const fn = mode === 'add'
        ? vehiclesApi.create({ make, model, category, price: p, quantity: q }, token)
        : vehiclesApi.update(initialData!.id, { make, model, category, price: p, quantity: q }, token);
      const res = await fn;
      if (res.error) setError(res.error);
      else { onNotify?.(`${mode === 'add' ? 'Added' : 'Updated'} ${make} ${model}.`, 'success'); onSuccess?.(); onClose(); }
    } catch (err: any) { setError(err.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all duration-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-6 space-y-5 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white">{mode === 'add' ? 'Add Vehicle' : 'Edit Vehicle'}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{mode === 'add' ? 'Publish to the live showroom.' : 'Update inventory record.'}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-white flex items-center justify-center transition-colors">×</button>
        </div>

        {error && <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Make</label>
              <input type="text" value={make} onChange={(e) => setMake(e.target.value)} placeholder="BMW" className={inputClass} required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Model</label>
              <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="M4 CSL" className={inputClass} required />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              <option>Sedan</option><option>SUV</option><option>Truck</option><option>Coupe</option>
              <option>Hatchback</option><option>Convertible</option><option>Wagon</option><option>Supercar</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="95000" className={inputClass} required />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Quantity</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="3" className={inputClass} required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition-colors">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-900 hover:bg-white transition-colors active:scale-95 transform disabled:opacity-50">
              {loading ? 'Saving...' : mode === 'add' ? 'Publish' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';

interface SearchFilterBarProps {
  onSearch?: (params: { make?: string; model?: string; category?: string; minPrice?: string; maxPrice?: string }) => void;
  onReset?: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ onSearch, onReset }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({
      make: make.trim() || undefined,
      model: model.trim() || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    });
  };

  const handleReset = () => {
    setMake(''); setModel(''); setCategory(''); setMinPrice(''); setMaxPrice('');
    onReset?.();
  };

  const inputClass = "w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all duration-200";

  return (
    <form onSubmit={handleSearch} className="animate-fade-up bg-zinc-900 p-5 rounded-xl border border-zinc-800/60">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div>
          <label htmlFor="search-make" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Make</label>
          <input id="search-make" type="text" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Porsche" className={inputClass} />
        </div>
        <div>
          <label htmlFor="search-model" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Model</label>
          <input id="search-model" type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="911" className={inputClass} />
        </div>
        <div>
          <label htmlFor="search-category" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Category</label>
          <select id="search-category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            <option value="">All</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Convertible">Convertible</option>
            <option value="Wagon">Wagon</option>
            <option value="Supercar">Supercar</option>
          </select>
        </div>
        <div>
          <label htmlFor="search-min-price" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Min $</label>
          <input id="search-min-price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className={inputClass} />
        </div>
        <div>
          <label htmlFor="search-max-price" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Max $</label>
          <input id="search-max-price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="500000" className={inputClass} />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-zinc-800/60">
        <button type="button" onClick={handleReset} className="px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-200 transition-colors duration-200">
          Reset
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-zinc-100 text-zinc-900 hover:bg-white transition-colors duration-200 active:scale-95 transform">
          Search
        </button>
      </div>
    </form>
  );
};


import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { db } from '../services/mockDb';
import { Product } from '../types';
// Added ShoppingBag to the imports from lucide-react
import { Search, MapPin, Share2, ShoppingBag } from 'lucide-react';
import { useApp } from '../App';

const StoreFront: React.FC = () => {
  const { settings } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setProducts(db.getProducts().filter(p => p.enabled));
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: settings.name,
        text: `Check out ${settings.name} for daily needs!`,
        url: window.location.href,
      });
    }
  };

  return (
    <CustomerLayout>
      {/* Store Hero Area */}
      <div className="bg-[#146eb4] text-white p-4 pt-0 pb-12 flex flex-col items-center">
        <div className="w-full bg-white/10 rounded-2xl p-4 flex gap-4 items-center mb-4">
          <img src={settings.logo} className="w-16 h-16 rounded-xl border border-white/20" alt="logo" />
          <div className="flex-1 overflow-hidden">
            <h2 className="text-xl font-bold truncate">{settings.name}</h2>
            <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
              <MapPin size={12} /> {settings.location}
            </p>
          </div>
          <button onClick={handleShare} className="p-2 bg-white/20 rounded-full">
            <Share2 size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..."
            className="w-full bg-white text-gray-800 py-3_pl-12 pr-4 rounded-xl text-sm focus:outline-none shadow-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="-mt-6 px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-x-auto no-scrollbar gap-4 p-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-[#146eb4] text-white' : 'bg-gray-50 text-gray-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-800">{activeCategory} Items ({filteredProducts.length})</h3>
        </div>
        
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="py-12 text-center text-gray-400 flex flex-col items-center">
            <ShoppingBag size={48} className="mb-2 opacity-20" />
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default StoreFront;

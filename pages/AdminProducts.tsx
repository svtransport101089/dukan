
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/Layout';
import { db } from '../services/mockDb';
import { Product } from '../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(db.getProducts());
  }, []);

  const handleToggleEnable = (product: Product) => {
    const updated = { ...product, enabled: !product.enabled };
    db.saveProduct(updated);
    setProducts(db.getProducts());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      db.deleteProduct(id);
      setProducts(db.getProducts());
    }
  };

  const ProductForm = ({ initialData }: { initialData?: Product }) => {
    const [formData, setFormData] = useState<Partial<Product>>(initialData || {
      name: '',
      price: 0,
      discountPrice: undefined,
      category: 'Grocery',
      stock: 0,
      image: 'https://picsum.photos/seed/new/400/400',
      enabled: true
    });
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const price = Number(formData.price);
      const discountPrice = formData.discountPrice !== undefined ? Number(formData.discountPrice) : undefined;

      // Validation logic
      if (price < 0) {
        setError("MRP must be 0 or greater.");
        return;
      }

      if (discountPrice !== undefined) {
        if (discountPrice < 0) {
          setError("Discount price cannot be negative.");
          return;
        }
        if (discountPrice > price) {
          setError("Discounted Selling Price must be less than or equal to the MRP.");
          return;
        }
      }

      const productToSave = {
        ...formData,
        price,
        discountPrice,
        id: initialData?.id || `prod_${Date.now()}`,
      } as Product;

      db.saveProduct(productToSave);
      setProducts(db.getProducts());
      setIsModalOpen(false);
      setEditingProduct(null);
    };

    return (
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Name</label>
          <input 
            required
            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">MRP / Base Price (₹)</label>
            <input 
              required
              type="number"
              step="0.01"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
              value={formData.price}
              onChange={e => setFormData({...formData, price: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Selling Price (₹)</label>
            <input 
              type="number"
              step="0.01"
              placeholder="Optional"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
              value={formData.discountPrice === undefined ? '' : formData.discountPrice}
              onChange={e => setFormData({...formData, discountPrice: e.target.value === '' ? undefined : Number(e.target.value)})}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
            <input 
              required
              type="number"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
              value={formData.stock}
              onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option>Grocery</option>
              <option>Snacks</option>
              <option>Stationery</option>
              <option>Daily Needs</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button 
            type="button" 
            onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="flex-1 px-4 py-3 bg-[#146eb4] text-white rounded-xl font-bold"
          >
            Save Product
          </button>
        </div>
      </form>
    );
  };

  return (
    <AdminLayout title="Products">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-gray-800">{products.length} Products</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#146eb4] text-white rounded-xl font-bold shadow-lg"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => {
          const displayPrice = product.discountPrice !== undefined ? product.discountPrice : product.price;
          const oldPrice = product.discountPrice !== undefined ? product.price : null;

          return (
            <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
              <img src={product.image} className="w-20 h-20 rounded-xl object-cover" alt={product.name} />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">{product.category} • {product.stock} left</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-black text-[#146eb4]">₹{displayPrice}</p>
                    {oldPrice !== null && (
                      <p className="text-[10px] text-gray-400 line-through">₹{oldPrice}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <button 
                    onClick={() => handleToggleEnable(product)}
                    className={`p-2 rounded-lg ${product.enabled ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                  >
                    {product.enabled ? <Eye size={16}/> : <EyeOff size={16}/>}
                  </button>
                  <button 
                    onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                    className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={16}/>
                  </button>
                  <button 
                     onClick={() => handleDelete(product.id)}
                     className="p-2 text-red-600 bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 max-h-[90vh] overflow-y-auto no-scrollbar">
            <h3 className="text-xl font-black mb-6 text-gray-800">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <ProductForm initialData={editingProduct || undefined} />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;


import React, { useState } from 'react';
import { AdminLayout } from '../components/Layout';
import { useApp } from '../App';
import { Save, Store, MapPin, Phone, CreditCard } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <AdminLayout title="Store Settings">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            <h3 className="text-xl font-black text-gray-800 border-b border-gray-50 pb-6">Store Profile</h3>
            
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 relative group">
                <img src={formData.logo} className="w-full h-full rounded-2xl object-cover border-2 border-gray-50 shadow-sm" alt="Logo" />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-[10px] font-bold">CHANGE</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Store Name</label>
                <div className="relative">
                  <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Public Contact Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Google Pay UPI ID</label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                    value={formData.upiId}
                    onChange={e => setFormData({...formData, upiId: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Business Location</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                <textarea 
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Store Description</label>
              <textarea 
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-colors ${isSaved ? 'bg-green-500 text-white' : 'bg-[#146eb4] text-white'}`}
          >
            {isSaved ? "Saved Successfully!" : "Save Changes"}
            <Save size={20} />
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

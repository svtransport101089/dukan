
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/Layout';
import { db } from '../services/mockDb';
import { Order } from '../types';
import { Search, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setOrders(db.getOrders());
  }, []);

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    db.updateOrderStatus(id, status);
    setOrders(db.getOrders());
  };

  const filteredOrders = orders.filter(o => filter === 'All' || o.status === filter);

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:items-center justify-between">
        <div className="flex overflow-x-auto no-scrollbar gap-2">
          {['All', 'Pending Verification', 'Paid', 'Cancelled'].map(s => (
            <button 
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${filter === s ? 'bg-[#146eb4] text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search order ID or phone" 
            className="w-full md:w-64 bg-white border border-gray-100 py-2.5 pl-11 pr-4 rounded-xl text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Order ID</p>
                <p className="font-black text-gray-800">#{order.id.slice(-8)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Amount</p>
                <p className="font-black text-[#146eb4]">₹{order.totalAmount}</p>
              </div>
            </div>
            
            <div className="p-4 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                    {order.customerName[0]}
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10}/> {order.customerMobile}</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-gray-600">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <p>{order.address}</p>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Items</p>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-600">{item.name} x {item.quantity}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.status === 'Pending Verification' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'Paid')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-bold"
                    >
                      <CheckCircle size={14} /> Confirm
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl text-xs font-bold"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {order.status === 'Paid' && (
                   <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black uppercase">Payment Verified</span>
                )}
                {order.status === 'Cancelled' && (
                   <span className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase">Cancelled</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <div className="py-24 text-center text-gray-400">
            No orders found matching this filter.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;

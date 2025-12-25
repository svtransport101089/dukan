
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/Layout';
import { db } from '../services/mockDb';
import { Order } from '../types';
import { TrendingUp, ShoppingBag, DollarSign, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(db.getOrders());
  }, []);

  const totalRevenue = orders.filter(o => o.status === 'Paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending Verification' || o.status === 'Pending').length;
  
  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'bg-orange-500' },
    { label: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-black text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black text-gray-800 text-lg">Recent Orders</h3>
          <button className="text-[#146eb4] text-sm font-bold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} className="text-sm">
                  <td className="px-6 py-4 font-medium text-gray-700">#{order.id.slice(-6)}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">No orders found yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;


import React, { useState } from 'react';
import { CustomerLayout } from '../components/Layout';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Order } from '../types';
import { Phone, MapPin, User, ArrowRight } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cart, clearCart, settings } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: ''
  });

  const calculateItemPrice = (item: any) => item.discountPrice !== undefined ? item.discountPrice : item.price;
  const total = cart.reduce((acc, curr) => acc + (calculateItemPrice(curr) * curr.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      customerName: formData.name,
      customerMobile: formData.mobile,
      address: formData.address,
      items: cart.map(i => ({ 
        productId: i.id, 
        name: i.name, 
        quantity: i.quantity, 
        price: calculateItemPrice(i) 
      })),
      totalAmount: total,
      status: 'Pending Verification',
      createdAt: Date.now()
    };

    db.createOrder(newOrder);
    
    // Auto-open WhatsApp with Order details
    const orderItemsText = cart.map(i => {
      const p = calculateItemPrice(i);
      return `${i.name} x ${i.quantity} = ₹${p * i.quantity}`;
    }).join('\n');

    const waMessage = `Hello ${settings.name}, I would like to place an order:
    
Order ID: ${newOrder.id}
Items:
${orderItemsText}

Total: ₹${total}

Delivery Details:
Name: ${formData.name}
Phone: ${formData.mobile}
Address: ${formData.address}

I am making the payment via Google Pay.`;

    const waUrl = `https://wa.me/91${settings.contact}?text=${encodeURIComponent(waMessage)}`;
    
    setTimeout(() => {
      clearCart();
      window.location.href = waUrl;
      navigate('/order-success', { state: { order: newOrder } });
    }, 1000);
  };

  if (cart.length === 0) {
    return (
      <CustomerLayout title="Checkout" showBack>
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <MapPin size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add items to your cart to checkout.</p>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#146eb4] text-white rounded-xl font-bold">
            Browse Products
          </button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout title="Checkout" showBack>
      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4">Delivery Information</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-gray-50 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  type="tel" 
                  pattern="[0-9]{10}"
                  placeholder="10-digit Mobile Number"
                  className="w-full bg-gray-50 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                />
              </div>

              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                <textarea 
                  required
                  placeholder="Delivery Address (House No, Building, Area, LandMark)"
                  rows={3}
                  className="w-full bg-gray-50 py-3.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-50 pb-4 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cart.map(item => {
                const itemPrice = calculateItemPrice(item);
                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                    <span className="font-medium text-gray-800">₹{itemPrice * item.quantity}</span>
                  </div>
                );
              })}
              <div className="border-t border-dashed border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-black text-xl text-[#146eb4]">₹{total}</span>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#146eb4] text-white py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Proceed to Payment"}
            <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          By continuing, you agree to our Terms & Conditions
        </p>
      </div>
    </CustomerLayout>
  );
};

export default Checkout;

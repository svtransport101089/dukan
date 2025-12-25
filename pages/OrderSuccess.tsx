
import React from 'react';
import { CustomerLayout } from '../components/Layout';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ExternalLink, QrCode } from 'lucide-react';
import { useApp } from '../App';

const OrderSuccess: React.FC = () => {
  const { settings } = useApp();
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <CustomerLayout>Invalid Access</CustomerLayout>;

  const handlePayNow = () => {
    const upiUrl = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.name)}&am=${order.totalAmount}&cu=INR`;
    window.location.href = upiUrl;
  };

  return (
    <CustomerLayout title="Order Placed" showBack>
      <div className="p-4 space-y-6 flex flex-col items-center">
        <div className="flex flex-col items-center text-center mt-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-500 text-sm mt-1">Order ID: #{order.id}</p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center border border-gray-100">
          <h3 className="font-black text-gray-800 text-lg mb-2">Scan or Pay with Google Pay</h3>
          <p className="text-gray-400 text-sm mb-6 text-center">Your order is currently "Pending Verification"</p>
          
          <div className="bg-gray-50 p-4 rounded-2xl mb-8">
            {/* Real QR would use a library, here we show a placeholder for aesthetics */}
            <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
              <QrCode size={64} />
              <span className="text-[10px] uppercase font-bold text-center px-4">UPI QR for ₹{order.totalAmount}</span>
            </div>
          </div>

          <button 
            onClick={handlePayNow}
            className="w-full bg-[#146eb4] text-white py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            Pay ₹{order.totalAmount} via GPay
            <ExternalLink size={20} />
          </button>
          
          <div className="mt-6 w-full space-y-3">
             <Link 
              to="/"
              className="w-full flex justify-center text-[#146eb4] font-bold text-sm"
            >
              I have paid! Go back to store
            </Link>
          </div>
        </div>

        <div className="w-full bg-blue-50 p-6 rounded-2xl border border-blue-100 text-sm text-blue-800 text-center">
          <p className="font-bold">What's Next?</p>
          <p className="mt-1">Once payment is confirmed, the admin will process your order and deliver it to your address in Tambaram.</p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderSuccess;


import React, { useState, useEffect } from 'react';
import { CustomerLayout } from '../components/Layout';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ExternalLink, Copy, Check, Info, AlertTriangle, MessageCircle } from 'lucide-react';
import { useApp } from '../App';

const OrderSuccess: React.FC = () => {
  const { settings } = useApp();
  const location = useLocation();
  const order = location.state?.order;
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showErrorHelp, setShowErrorHelp] = useState(false);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  if (!order) return <CustomerLayout>Invalid Access</CustomerLayout>;

  // Format amount to 2 decimal places (crucial for some UPI apps)
  const formattedAmount = Number(order.totalAmount).toFixed(2);
  const transactionId = order.id.replace('ord_', '');
  const transactionNote = `Order #${order.id.slice(-6)} at ${settings.name}`;
  
  // Enhanced UPI URL with transaction reference (tr) and note (tn)
  const upiUrl = `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.name)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  const handlePayNow = () => {
    setShowErrorHelp(false);
    
    if (!isMobile) {
      alert("UPI Payment apps are typically only available on mobile devices. Please scan the QR code using your phone's GPay app.");
      return;
    }

    // Attempt to open the UPI app
    window.location.assign(upiUrl);

    // If the user is still on this page after 2.5 seconds, the app likely didn't open
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setShowErrorHelp(true);
      }
    }, 2500);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(settings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactWhatsApp = () => {
    const msg = `Hi, I am facing an issue with the Google Pay payment for Order #${order.id.slice(-8)}. Total: ₹${formattedAmount}. My UPI ID is: `;
    window.open(`https://wa.me/91${settings.contact}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <CustomerLayout title="Order Confirmation" showBack>
      <div className="p-4 space-y-6 flex flex-col items-center">
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Order Placed!</h2>
          <p className="text-gray-500 text-sm mt-1">Order ID: <span className="font-mono font-bold text-gray-700">#{order.id.slice(-8)}</span></p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center border border-gray-100 relative overflow-hidden">
          {/* Decorative tag */}
          <div className="absolute top-0 right-0 bg-[#146eb4] text-white text-[10px] px-4 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
            Pending Payment
          </div>

          <div className="text-center mb-6 pt-2">
            <h3 className="font-black text-gray-800 text-lg">Complete Your Payment</h3>
            <p className="text-[#146eb4] font-black text-2xl mt-1">₹{formattedAmount}</p>
          </div>
          
          {/* QR Code Section */}
          <div className="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-inner mb-6">
            <img 
              src={qrUrl} 
              alt="Payment QR Code" 
              className="w-48 h-48"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/250?text=Scan+to+Pay';
              }}
            />
            <p className="text-[10px] text-gray-400 text-center mt-3 font-bold uppercase tracking-widest">Scan using GPay / PhonePe</p>
          </div>

          <div className="w-full space-y-3">
            <button 
              onClick={handlePayNow}
              className="w-full bg-[#146eb4] text-white py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-[#115a95]"
            >
              Pay via UPI App
              <ExternalLink size={20} />
            </button>

            {showErrorHelp && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle size={18} />
                  <p className="text-sm font-bold">Having trouble paying?</p>
                </div>
                <ul className="text-xs text-red-700 space-y-1 ml-6 list-disc">
                  <li>Ensure Google Pay or PhonePe is installed.</li>
                  <li>Try scanning the QR code above.</li>
                  <li>Manually copy the UPI ID below.</li>
                </ul>
              </div>
            )}

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase ml-1">Merchant UPI ID</p>
                <p className="text-sm font-bold text-gray-700 truncate px-1">{settings.upiId}</p>
              </div>
              <button 
                onClick={copyUpiId}
                className="p-2.5 bg-white rounded-lg shadow-sm text-[#146eb4] hover:bg-blue-50 transition-colors"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center w-full gap-3">
             <button 
              onClick={contactWhatsApp}
              className="w-full flex justify-center items-center gap-2 text-green-600 font-bold text-sm bg-green-50 py-3 rounded-xl border border-green-100"
            >
              <MessageCircle size={18} />
              Help on WhatsApp
            </button>

             <Link 
              to="/"
              className="w-full flex justify-center items-center gap-2 text-gray-400 font-bold text-xs py-2 rounded-xl"
            >
              Back to Store
            </Link>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-[#146eb4] mt-0.5" />
              <div className="text-[11px] text-blue-800 leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-wider">How to verify?</p>
                <p>After your payment is successful, the merchant will receive a notification. Once verified, your order status will be updated to "Paid".</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <p className="text-[10px] text-gray-300 font-medium italic">Secure UPI Payment Interface • Parthi Store</p>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderSuccess;

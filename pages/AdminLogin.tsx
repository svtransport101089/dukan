
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../App';
import { ShieldCheck, Phone, ArrowRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { setAdmin } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) setStep(2);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate real OTP verification
    if (otp === '1234') {
      setAdmin(true);
      navigate('/admin/dashboard');
    } else {
      alert('Demo OTP is 1234');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-50 text-[#146eb4] rounded-3xl mb-4">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Admin Login</h1>
          <p className="text-gray-500 mt-2">Access your store dashboard</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</span>
              <input 
                required
                type="tel" 
                pattern="[0-9]{10}"
                placeholder="Mobile Number"
                className="w-full bg-gray-50 py-4 pl-16 pr-4 rounded-2xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-[#146eb4] text-white py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3">
              Get OTP <ArrowRight size={20} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-center text-sm text-gray-400">Enter code sent to <b>+91 {phone}</b></p>
            <input 
              required
              type="text" 
              placeholder="Enter 4-digit OTP"
              className="w-full bg-gray-50 py-4 px-4 rounded-2xl text-center text-2xl font-black tracking-[1em] focus:outline-none focus:ring-2 focus:ring-[#146eb4]"
              maxLength={4}
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button type="submit" className="w-full bg-[#146eb4] text-white py-4 rounded-2xl font-black text-lg shadow-lg">
              Verify OTP
            </button>
            <button onClick={() => setStep(1)} className="w-full text-gray-400 font-bold text-sm">Resend code</button>
          </form>
        )}

        <div className="pt-8 border-t border-gray-50 text-center">
          <Link to="/" className="text-sm font-bold text-gray-400 hover:text-[#146eb4]">
            &larr; Return to Customer Store
          </Link>
          <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-xl text-[10px] text-orange-600 font-bold uppercase">
            Demo: Enter any phone and OTP 1234
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Home, 
  Settings, 
  Package, 
  BarChart2, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../App';
import { DUKAAN_BLUE } from '../constants';

export const CustomerLayout: React.FC<{ children: React.ReactNode, title?: string, showBack?: boolean }> = ({ children, title, showBack }) => {
  const { cart, settings } = useApp();
  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-lg bg-[#146eb4] text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <button onClick={() => window.history.back()}>
                <ChevronLeft size={24} />
              </button>
            )}
            {!showBack && settings.logo && (
              <img src={settings.logo} alt="logo" className="w-8 h-8 rounded-full border border-white/20" />
            )}
            <h1 className="font-bold text-lg truncate max-w-[180px]">{title || settings.name}</h1>
          </div>
          <Link to="/checkout" className="relative p-2">
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#146eb4] font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>
      
      <main className="w-full max-w-lg">
        {children}
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 w-full max-w-lg bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50">
        <Link to="/" className="flex flex-col items-center gap-1 text-[#146eb4]">
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/checkout" className="flex flex-col items-center gap-1 text-gray-400">
          <ShoppingBag size={20} />
          <span className="text-[10px] font-medium">Orders</span>
        </Link>
        <Link to="/admin/login" className="flex flex-col items-center gap-1 text-gray-400">
          <Settings size={20} />
          <span className="text-[10px] font-medium">Manage</span>
        </Link>
      </nav>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode, title: string }> = ({ children, title }) => {
  const { setAdmin } = useApp();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', icon: BarChart2, path: '/admin/dashboard' },
    { label: 'Orders', icon: Package, path: '/admin/orders' },
    { label: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 bg-[#146eb4] text-white flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Dukaan Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname.includes(item.path) ? 'bg-white/10 font-bold' : 'hover:bg-white/5'}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <button 
          onClick={() => setAdmin(false)}
          className="p-6 border-t border-white/10 flex items-center gap-3 hover:bg-white/5 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40 flex justify-between items-center md:hidden">
          <h1 className="font-bold text-lg text-gray-800">{title}</h1>
          <button onClick={() => setAdmin(false)} className="text-gray-500"><LogOut size={20}/></button>
        </header>
        <header className="hidden md:flex bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
          <h1 className="font-bold text-xl text-gray-800 ml-4">{title}</h1>
        </header>

        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>

        {/* Bottom Nav for Admin Mobile */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-50">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${location.pathname.includes(item.path) ? 'text-[#146eb4]' : 'text-gray-400'}`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

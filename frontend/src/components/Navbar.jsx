import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, LogOut, LayoutGrid, CreditCard } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-metallic-gray-900 text-white border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tighter">
          <div className="bg-white/10 p-2 rounded-xl border border-white/10 shadow-lg">
            <Eye size={24} className="text-white" />
          </div>
          SECUREEYE
        </Link>

        <div className="flex gap-8 items-center">
          <Link to="/pricing" className="text-[10px] font-black uppercase tracking-widest text-metallic-gray-400 hover:text-white transition flex items-center gap-2">
            <CreditCard size={14} /> Subscription
          </Link>

          {token ? (
            <>
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-metallic-gray-400 hover:text-white transition flex items-center gap-2">
                <LayoutGrid size={14} /> Ops Center
              </Link>
              <button onClick={handleLogout} className="bg-white text-dark-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-metallic-gray-200 transition shadow-lg flex items-center gap-2">
                <LogOut size={14} /> Terminate Session
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-metallic-gray-400 hover:text-white transition">Login</Link>
              <Link to="/register" className="bg-white text-dark-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-metallic-gray-200 transition shadow-xl border border-white">Join the Network</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

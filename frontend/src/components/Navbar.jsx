import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600"><Eye size={28} /> SecureEye</Link>
        <div className="flex gap-6 items-center">
          <Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
          {token ? (
            <><Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link><button onClick={handleLogout} className="bg-gray-100 px-4 py-2 rounded-md">Logout</button></>
          ) : (
            <><Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link><Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md">Join Now</Link></>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) { alert("Login failed"); }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login to SecureEye</h2>
        <div className="mb-4"><label className="block mb-2">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" /></div>
        <div className="mb-6"><label className="block mb-2">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" /></div>
        <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};
export default Login;

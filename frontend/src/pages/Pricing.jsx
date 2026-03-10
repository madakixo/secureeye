import React, { useState } from 'react';
import axios from 'axios';
import { Check, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';

const Pricing = () => {
  const [cameraCount, setCameraCount] = useState(1);

  const calculatePrice = (base) => {
    if (cameraCount >= 10) return Math.round(base * 1.45);
    if (cameraCount >= 5) return Math.round(base * 1.30);
    return base;
  };

  const handlePayment = async (plan) => {
    const base = plan === 'basic' ? 5000 : 15000;
    const amount = calculatePrice(base);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/payments/initiate', { amount, cameraCount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.link;
    } catch (err) {
      alert("Please login first to subscribe.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 tracking-tight">Flexible AI Surveillance</h1>
        <p className="text-metallic-gray-600 text-lg">Secure your location with high-performance AI monitoring</p>

        <div className="mt-8 flex flex-col items-center">
          <label className="text-sm font-bold uppercase text-metallic-gray-500 mb-2">Number of Connected CCTV Cameras</label>
          <div className="flex items-center gap-6 bg-white p-2 rounded-2xl shadow-inner border border-metallic-gray-200">
            <button
              onClick={() => setCameraCount(Math.max(1, cameraCount - 1))}
              className="w-12 h-12 rounded-xl bg-metallic-gray-100 flex items-center justify-center font-bold text-2xl hover:bg-metallic-gray-200 transition"
            >-</button>
            <span className="text-3xl font-black w-12 text-center">{cameraCount}</span>
            <button
              onClick={() => setCameraCount(Math.min(15, cameraCount + 1))}
              className="w-12 h-12 rounded-xl bg-metallic-gray-100 flex items-center justify-center font-bold text-2xl hover:bg-metallic-gray-200 transition"
            >+</button>
          </div>
          <p className="mt-3 text-xs font-bold text-metallic-gray-400">
            {cameraCount < 5 ? "Base Price (1-4 Cameras)" :
             cameraCount < 10 ? "30% Volume Increase (5-9 Cameras)" :
             "45% Volume Increase (10-15 Cameras)"}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Basic Eye */}
        <div className="glass-card p-10 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-metallic-gray-100 p-3 rounded-2xl"><ShieldCheck className="text-dark-black" /></div>
            <h2 className="text-2xl font-black">Basic Eye</h2>
          </div>
          <p className="text-metallic-gray-600 mb-8">Essential security for homes and small offices.</p>
          <div className="mb-10">
            <span className="text-5xl font-black tracking-tighter">₦{calculatePrice(5000).toLocaleString()}</span>
            <span className="text-metallic-gray-400 font-bold ml-2 uppercase text-xs">/ Month</span>
          </div>
          <ul className="space-y-4 mb-12 flex-grow">
            <li className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-green-500" /> Motion Detection</li>
            <li className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-green-500" /> Real-time Feed Access</li>
            <li className="flex items-center gap-3 font-bold text-sm text-metallic-gray-400"><Lock size={18} /> Face Recognition</li>
            <li className="flex items-center gap-3 font-bold text-sm text-metallic-gray-400"><Lock size={18} /> License Plate Reading</li>
          </ul>
          <button onClick={() => handlePayment('basic')} className="btn-metallic w-full py-4 uppercase tracking-widest text-xs">Activate Basic</button>
        </div>

        {/* Pro Eye */}
        <div className="glass-card p-10 border-2 border-dark-black relative overflow-hidden flex flex-col scale-105 shadow-2xl">
          <div className="absolute top-0 right-0 bg-dark-black text-white px-6 py-2 font-black text-[10px] uppercase tracking-[0.2em] rounded-bl-2xl">Recommended</div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-dark-black p-3 rounded-2xl"><Zap className="text-white" /></div>
            <h2 className="text-2xl font-black">Pro Eye</h2>
          </div>
          <p className="text-metallic-gray-600 mb-8">Advanced AI analytics for high-security environments.</p>
          <div className="mb-10">
            <span className="text-5xl font-black tracking-tighter">₦{calculatePrice(15000).toLocaleString()}</span>
            <span className="text-metallic-gray-400 font-bold ml-2 uppercase text-xs">/ Month</span>
          </div>
          <ul className="space-y-4 mb-12 flex-grow">
            <li className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-dark-black" /> Face Recognition & IDs</li>
            <li className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-dark-black" /> License Plate (ALPR)</li>
            <li className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-dark-black" /> Car & Vehicle ID</li>
            <li className="flex items-center gap-3 font-bold text-sm"><Check size={18} className="text-dark-black" /> Multi-region Backup</li>
          </ul>
          <button onClick={() => handlePayment('pro')} className="btn-primary w-full py-4 uppercase tracking-widest text-xs">Unlock Pro Access</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

import React from 'react';
import axios from 'axios';
const Pricing = () => {
  const handlePayment = async (plan) => {
    const amount = plan === 'basic' ? 5000 : 15000;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/payments/initiate', { amount }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = res.data.link;
    } catch (err) { alert("Please login first to subscribe."); }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Basic Eye</h2>
          <p className="text-gray-600 mb-6">Person & Motion Detection</p>
          <p className="text-4xl font-bold mb-6">₦5,000<span className="text-lg font-normal text-gray-500">/mo</span></p>
          <button onClick={() => handlePayment('basic')} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Subscribe Now</button>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border-2 border-blue-500 relative">
          <span className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-lg">Popular</span>
          <h2 className="text-2xl font-bold mb-4">Pro Eye</h2>
          <p className="text-gray-600 mb-6">Face recognition & ALPR included</p>
          <p className="text-4xl font-bold mb-6">₦15,000<span className="text-lg font-normal text-gray-500">/mo</span></p>
          <button onClick={() => handlePayment('pro')} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Subscribe Now</button>
        </div>
      </div>
    </div>
  );
};
export default Pricing;

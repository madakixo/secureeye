import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, CheckCircle, ArrowRight } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [cameraData, setCameraData] = useState({ name: '', stream_url: '' });
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);

  const handleFinish = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/cameras', cameraData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      alert("Failed to add camera. You can skip this for now.");
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-full mx-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome to SecureEye!</h1>
            <p className="text-gray-600 mb-8">Your account has been created. Let's get your first camera set up in just a few seconds.</p>
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Camera className="text-blue-600" /> Register your first IP Camera</h2>
            <p className="text-gray-600 mb-6">Enter the stream URL for your IP camera. We support RTSP, HLS, and HTTP streams.</p>
            <form onSubmit={handleFinish} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Camera Name (e.g., Office Entry)</label>
                <input
                  required
                  type="text"
                  value={cameraData.name}
                  onChange={e => setCameraData({...cameraData, name: e.target.value})}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Front Door"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IP Camera URL (RTSP/HLS)</label>
                <input
                  required
                  type="text"
                  value={cameraData.stream_url}
                  onChange={e => setCameraData({...cameraData, stream_url: e.target.value})}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="rtsp://username:password@192.168.1.10:554/stream"
                />
                <p className="text-xs text-gray-400 mt-2">Example: rtsp://admin:12345@192.168.1.50:554/live</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 border py-3 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Skip for now
                </button>
                <button
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Camera, Mail, Phone, MapPin, ArrowRight, UserCircle } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    whatsapp: '',
    location: '',
    profile_pic: ''
  });
  const [cameraData, setCameraData] = useState({ name: '', stream_url: '' });
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);

  const handleFinish = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      // 1. Update Profile
      await axios.put('/api/user/profile', profileData, { headers });
      // 2. Add First Camera
      if (cameraData.name) {
        await axios.post('/api/cameras', cameraData, { headers });
      }
      navigate('/dashboard');
    } catch (err) {
      alert("Something went wrong, but you can continue to the dashboard.");
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="glass-card p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-metallic-gray-100 flex">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-full transition-all duration-500 ${step >= i ? 'bg-dark-black w-1/3' : 'w-0'}`} />
           ))}
        </div>

        {step === 1 && (
          <div className="text-center">
            <div className="bg-metallic-gray-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl border border-white">
              <UserCircle className="text-dark-black" size={40} />
            </div>
            <h1 className="text-4xl font-black mb-4 tracking-tight">Complete Your Profile</h1>
            <p className="text-metallic-gray-600 mb-10 text-lg">We need a few more details to set up your secure monitoring environment.</p>

            <div className="space-y-4 mb-10 text-left">
              <div className="relative">
                <Phone className="absolute top-1/2 -translate-y-1/2 left-4 text-metallic-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="WhatsApp Number"
                  value={profileData.whatsapp}
                  onChange={e => setProfileData({...profileData, whatsapp: e.target.value})}
                  className="w-full bg-metallic-gray-50 border-2 border-metallic-gray-200 p-4 pl-12 rounded-xl focus:border-dark-black outline-none transition"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute top-1/2 -translate-y-1/2 left-4 text-metallic-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Installation Location (e.g. Lagos, Nigeria)"
                  value={profileData.location}
                  onChange={e => setProfileData({...profileData, location: e.target.value})}
                  className="w-full bg-metallic-gray-50 border-2 border-metallic-gray-200 p-4 pl-12 rounded-xl focus:border-dark-black outline-none transition"
                />
              </div>
            </div>

            <button onClick={handleNext} className="btn-primary w-full py-4 uppercase tracking-widest text-xs font-black">Continue to CCTV Setup</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="bg-metallic-gray-100 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-xl border border-white">
              <Camera className="text-dark-black" size={40} />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight">Register First Camera</h2>
            <p className="text-metallic-gray-600 mb-10">Paste the RTSP or HLS link of your IP camera here.</p>

            <form onSubmit={handleFinish} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Camera Name (e.g. Warehouse A)"
                value={cameraData.name}
                onChange={e => setCameraData({...cameraData, name: e.target.value})}
                className="w-full bg-metallic-gray-50 border-2 border-metallic-gray-200 p-4 rounded-xl focus:border-dark-black outline-none transition"
              />
              <input
                required
                type="text"
                placeholder="IP Camera Stream URL"
                value={cameraData.stream_url}
                onChange={e => setCameraData({...cameraData, stream_url: e.target.value})}
                className="w-full bg-metallic-gray-50 border-2 border-metallic-gray-200 p-4 rounded-xl focus:border-dark-black outline-none transition"
              />
              <p className="text-[10px] font-black uppercase text-metallic-gray-400 mb-10">We support: RTSP, HTTP-MJPEG, HLS, ONVIF</p>

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-metallic flex-1 py-4 uppercase tracking-widest text-[10px]">Skip</button>
                <button className="btn-primary flex-1 py-4 uppercase tracking-widest text-[10px]">Complete Setup</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

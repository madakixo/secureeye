import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Plus, ShieldAlert, X, Lock, Settings, LayoutGrid, MonitorPlay } from 'lucide-react';
import { Link } from 'react-router-dom';
import CameraGrid from '../components/CameraGrid';

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [detections, setDetections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCamera, setNewCamera] = useState({ name: '', stream_url: '' });
  const [user, setUser] = useState({ is_paid: false, name: '' });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if(!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [camRes, detRes, userRes] = await Promise.all([
        axios.get('/api/cameras', { headers }),
        axios.get('/api/detections', { headers }),
        axios.get('/api/auth/profile', { headers }).catch(() => ({ data: { is_paid: false, name: '' } }))
      ]);
      setCameras(camRes.data);
      setDetections(detRes.data);
      setUser(userRes.data);
    } catch(e) { console.error(e); }
  };

  const handleAddCamera = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/cameras', newCamera, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setNewCamera({ name: '', stream_url: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add camera");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Security Operations</h1>
          <p className="text-metallic-gray-600 font-bold uppercase text-[10px] tracking-widest mt-1">Status: {user.is_paid ? "Active Pro Monitoring" : "Analysis Disabled"}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-metallic flex items-center gap-2"
          >
            <Plus size={18} /> <span className="uppercase text-[10px] tracking-widest font-black">Add CCTV Unit</span>
          </button>
          <Link to="/profile" className="btn-metallic flex items-center gap-2">
            <Settings size={18} />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2"><LayoutGrid size={24} /> Video Matrix</h2>
            <div className="flex gap-2">
              <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black uppercase text-dark-black border border-metallic-gray-200">Total Cameras: {cameras.length}</span>
            </div>
          </div>

          <div className="glass-card p-4 bg-metallic-gray-200/50">
             <CameraGrid cameras={cameras} isPaid={user.is_paid} />
          </div>
        </div>

        <div className="space-y-10">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={24} /> Intelligence</h2>
          <div className="glass-card h-[700px] flex flex-col overflow-hidden bg-white/40">
            <div className="p-4 border-b border-metallic-gray-100 bg-metallic-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-dark-black">Real-time Detections</span>
              <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto divide-y divide-metallic-gray-100">
              {!user.is_paid && cameras.length > 0 && (
                <div className="p-10 text-center text-metallic-gray-400">
                  <Lock className="mx-auto mb-4 opacity-30" size={48} />
                  <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Intelligence analysis is locked for basic accounts.</p>
                  <Link to="/pricing" className="text-[10px] text-dark-black underline font-black block mt-6 uppercase tracking-widest">Upgrade Access</Link>
                </div>
              )}
              {user.is_paid && detections.length === 0 && (
                <div className="p-10 text-center text-metallic-gray-400 italic text-sm">Waiting for incoming security metadata...</div>
              )}
              {user.is_paid && detections.map(det => (
                <div key={det.id} className="p-4 hover:bg-white/80 transition cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-dark-black text-white rounded">{det.type}</span>
                    <span className="text-[9px] font-bold text-metallic-gray-400 tabular-nums">{new Date(det.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm font-black text-dark-black">{det.label}</p>
                  <p className="text-[9px] font-bold text-metallic-gray-400 uppercase tracking-tighter mt-1 flex items-center gap-1"><MonitorPlay size={10} /> Cam {det.camera_id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="glass-card p-10 w-full max-w-md bg-white border-2 border-dark-black">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black tracking-tight">Add CCTV Unit</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition p-1"><X /></button>
            </div>
            <form onSubmit={handleAddCamera} className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-metallic-gray-500 block mb-2">Location Identity</label>
                <input
                  required
                  type="text"
                  value={newCamera.name}
                  onChange={e => setNewCamera({...newCamera, name: e.target.value})}
                  className="w-full bg-metallic-gray-50 border-2 border-metallic-gray-100 p-4 rounded-xl focus:border-dark-black outline-none transition font-bold"
                  placeholder="Front Access"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-metallic-gray-500 block mb-2">IP Stream URL</label>
                <input
                  required
                  type="text"
                  value={newCamera.stream_url}
                  onChange={e => setNewCamera({...newCamera, stream_url: e.target.value})}
                  className="w-full bg-metallic-gray-50 border-2 border-metallic-gray-100 p-4 rounded-xl focus:border-dark-black outline-none transition font-bold"
                  placeholder="rtsp://admin:pass@IP:554"
                />
              </div>
              <button className="btn-primary w-full py-4 uppercase tracking-widest text-xs font-black mt-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                Initialize Connection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Plus, ShieldAlert, X, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [detections, setDetections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCamera, setNewCamera] = useState({ name: '', stream_url: '' });
  const [isPaid, setIsPaid] = useState(false);

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
        axios.get('/api/auth/profile', { headers }).catch(() => ({ data: { is_paid: false } }))
      ]);
      setCameras(camRes.data);
      setDetections(detRes.data);
      setIsPaid(userRes.data.is_paid);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={20} /> Add Camera
        </button>
      </div>

      {!isPaid && cameras.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Lock className="text-amber-600" />
            <p className="text-amber-700">AI analysis is currently disabled. <span className="font-bold">Upgrade your plan</span> to start receiving alerts and face recognition.</p>
          </div>
          <Link to="/pricing" className="bg-amber-600 text-white px-4 py-1 rounded text-sm font-semibold hover:bg-amber-700 transition">Upgrade Now</Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Camera /> Active Feeds</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {cameras.length === 0 && (
              <div className="col-span-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
                No cameras registered. Click "Add Camera" to link your IP camera.
              </div>
            )}
            {cameras.map(cam => (
              <div key={cam.id} className="bg-black aspect-video rounded-lg relative overflow-hidden flex items-center justify-center text-white/50 border border-gray-800">
                {!isPaid ? (
                  <div className="text-center p-4">
                    <Lock className="mx-auto mb-2 opacity-30" size={32} />
                    <p className="font-medium text-white">{cam.name}</p>
                    <p className="text-xs text-gray-500 italic mt-1">Analysis Locked</p>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="font-medium text-white">{cam.name}</p>
                    <p className="text-xs truncate max-w-[200px]">{cam.stream_url}</p>
                  </div>
                )}

                {isPaid && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><ShieldAlert /> Recent Alerts</h2>
          <div className="bg-white rounded-lg shadow border border-gray-200 divide-y max-h-[600px] overflow-y-auto">
            {!isPaid && cameras.length > 0 && (
              <div className="p-8 text-center text-gray-400">
                <Lock className="mx-auto mb-2" size={24} />
                <p className="text-sm">Alerts are available on Pro plans.</p>
              </div>
            )}
            {isPaid && detections.length === 0 && <p className="p-4 text-gray-500 text-center">No alerts detected yet.</p>}
            {isPaid && detections.map(det => (
              <div key={det.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-blue-600 capitalize">{det.type}</p>
                    <p className="text-sm text-gray-800 font-semibold">{det.label}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(det.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Register IP Camera</h3>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleAddCamera} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Camera Name</label>
                <input
                  required
                  type="text"
                  value={newCamera.name}
                  onChange={e => setNewCamera({...newCamera, name: e.target.value})}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Front Door"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">IP Camera URL (RTSP/HLS)</label>
                <input
                  required
                  type="text"
                  value={newCamera.stream_url}
                  onChange={e => setNewCamera({...newCamera, stream_url: e.target.value})}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="rtsp://admin:pass@192.168.1.100:554/ch1"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold">
                Register Camera
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;

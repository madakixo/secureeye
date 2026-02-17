import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Plus, ShieldAlert } from 'lucide-react';
const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [detections, setDetections] = useState([]);
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
      const [camRes, detRes] = await Promise.all([
        axios.get('/api/cameras', { headers }),
        axios.get('/api/detections', { headers })
      ]);
      setCameras(camRes.data);
      setDetections(detRes.data);
    } catch(e) { console.error(e); }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md"><Plus size={20} /> Add Camera</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Camera /> Active Feeds</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {cameras.map(cam => (
              <div key={cam.id} className="bg-black aspect-video rounded-lg relative overflow-hidden flex items-center justify-center text-white/50">
                {cam.name} - Live Stream
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><div className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><ShieldAlert /> Recent Alerts</h2>
          <div className="bg-white rounded-lg shadow border border-gray-200 divide-y">
            {detections.length === 0 && <p className="p-4 text-gray-500 text-center">No alerts detected yet.</p>}
            {detections.map(det => (
              <div key={det.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div><p className="font-medium text-blue-600 capitalize">{det.type}</p><p className="text-sm text-gray-800">{det.label}</p></div>
                  <span className="text-xs text-gray-400">{new Date(det.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;

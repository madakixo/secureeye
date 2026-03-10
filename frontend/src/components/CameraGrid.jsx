import React from 'react';
import { Lock, Camera, Maximize2 } from 'lucide-react';

const CameraGrid = ({ cameras, isPaid }) => {
  const getGridClass = (count) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <div className={`grid gap-4 ${getGridClass(cameras.length)}`}>
      {cameras.map((cam, idx) => (
        <div key={cam.id} className="relative aspect-video bg-metallic-gray-900 rounded-xl overflow-hidden border-2 border-metallic-gray-200 group">
          {!isPaid ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
              <Lock className="text-metallic-gray-400 mb-2" size={40} />
              <p className="text-white text-sm font-bold uppercase tracking-widest">{cam.name}</p>
              <p className="text-metallic-gray-400 text-xs mt-1">Unlock AI with Pro Plan</p>
            </div>
          ) : (
            <>
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                <div className="bg-red-600 w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">Live - {cam.name}</span>
              </div>
              <div className="w-full h-full flex items-center justify-center">
                 <Camera className="text-metallic-gray-800 opacity-20" size={64} />
              </div>
              <button className="absolute bottom-3 right-3 p-1.5 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition text-white">
                <Maximize2 size={16} />
              </button>
            </>
          )}
        </div>
      ))}
      {cameras.length === 0 && (
        <div className="aspect-video bg-metallic-gray-200 rounded-xl border-2 border-dashed border-metallic-gray-400 flex flex-col items-center justify-center text-metallic-gray-600 col-span-full">
           <Camera size={48} className="mb-2 opacity-30" />
           <p className="font-semibold">Connect an IP Camera URL to begin</p>
        </div>
      )}
    </div>
  );
};

export default CameraGrid;

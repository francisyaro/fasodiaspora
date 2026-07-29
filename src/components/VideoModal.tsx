'use client';

import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Maximize, Play, Pause } from 'lucide-react';

interface VideoModalData {
  title: string;
  url: string;
}

export default function VideoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [videoData, setVideoData] = useState<VideoModalData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handlePlayVideo = (e: Event) => {
      const customEvent = e as CustomEvent<VideoModalData>;
      setVideoData(customEvent.detail);
      setIsOpen(true);
      setIsPlaying(true);
    };

    window.addEventListener('play-video', handlePlayVideo);
    return () => window.removeEventListener('play-video', handlePlayVideo);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setVideoData(null);
  };

  if (!isOpen || !videoData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose}></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="flex justify-between items-center px-6 py-4 bg-slate-950 border-b border-slate-850 text-white">
          <h4 className="font-bold text-sm md:text-base truncate max-w-xl">
            {videoData.title}
          </h4>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-burkina-red hover:text-white transition-colors"
            aria-label="Fermer"
            id="close-video-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <video
            src={videoData.url}
            autoPlay={isPlaying}
            muted={isMuted}
            controls
            className="w-full h-full object-contain"
          />
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3.5 bg-slate-950 text-xs text-slate-400 flex justify-between items-center">
          <span>Lecteur Faso Diaspora TV HD</span>
          <span className="font-bold text-[10px] text-burkina-yellow bg-burkina-red/10 px-2 py-1 rounded">DIRECT FLUX</span>
        </div>

      </div>
    </div>
  );
}

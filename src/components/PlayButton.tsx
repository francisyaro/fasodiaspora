'use client';

import React from 'react';

interface PlayButtonProps {
  title: string;
  videoUrl: string;
  className: string;
  children: React.ReactNode;
}

export default function PlayButton({ title, videoUrl, className, children }: PlayButtonProps) {
  const handlePlay = () => {
    const event = new CustomEvent('play-video', {
      detail: { title, url: videoUrl }
    });
    window.dispatchEvent(event);
  };

  return (
    <button 
      onClick={handlePlay} 
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}
